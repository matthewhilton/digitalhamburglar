import { Profile, Token } from "./interfaces";
import { PrismaClient } from '@prisma/client'
import { login, refreshToken, testToken } from "./mcdapi";
import { sampleSize, difference } from "lodash";
const prisma = new PrismaClient();

enum AccountState {
    ManualInactive = 0,
    Active = 1,
    OutOfRotation = 2
}

export const get_token_for_account = async (profile: Profile): Promise<Token> => {
    // Lookup by username as username is unique
    const user = await prisma.accounts.findFirst({
        where: {
            username: profile.username,
        }
    })

    if(user === null){
        // User hasn't been logged in according to DB, so login and save token to DB
        console.log("user does not exist, getting new token and saving")
        return reset_account_token(profile)
    }

    const usersToken = <Token> {
        accessToken: user.accesstoken,
        refreshToken: user.refreshtoken
    }

    // User has logged in sometime in the past, check how long ago to see if token can be reused.
    const hoursBetweenDates = Math.abs(new Date().valueOf() - user.tokenlastrefreshed.valueOf()) / 1000 / 60 / 60
    console.log(`Token is ${hoursBetweenDates} hours old.`)

    // Use tokens if they are about less than an hour old
    if(hoursBetweenDates < 0.9){
        console.log("Token is not old enough to renew, testing token")
        const tokenValid = await testToken(usersToken);

        if(!tokenValid) {
            console.log("Token was not valid, resetting token...")
            return await reset_account_token(profile);
        }

        console.log("Token is valid.")
        return usersToken
    }

    // Else token is old and needs to be refreshed
    try {
        console.log("Refreshing Token...")
        const refreshedToken = await refreshToken(usersToken);
        // Save new refreshed token
        const data = {
            accesstoken: refreshedToken.accessToken,
            refreshtoken: refreshedToken.refreshToken,
            tokenlastrefreshed: new Date()
        }

        await prisma.accounts.update({
            where: {
                username: profile.username,
            }, 
            data: data
        })

        return refreshedToken;
    } catch {
        // If error refreshing token, try and reset it 
        console.log("Error Refreshing Token, Trying to by logging in again...")
        return await reset_account_token(profile);
    }
}

export const reset_account_token = async (profile: Profile): Promise<Token> => {
    // Get brand new token and save to DB
    const token = await login(profile);
    
    const data = {
        username: profile.username,
        password: profile.password,
        accesstoken: token.accessToken,
        refreshtoken: token.refreshToken,
        tokenlastrefreshed: new Date(),
        state: profile.state,
    }

    const user = await prisma.accounts.findFirst({
        where: {
            username: profile.username,
        }
    })

    if(user === null){
        await prisma.accounts.create({data: data})
    } else {
        await prisma.accounts.update({
            where: {
                id: user.id
            }, 
            data: data
        })
    }

    return token;
}

export const get_profile_db = async (token: Token): Promise<Profile> => {
    return await prisma.accounts.findFirst({
        where: {
            accesstoken: token.accessToken,
        }
    }) as Profile
}

// Gets all the accounts, and allocates a certain percentage as active
// So that not every account is used every day, so it appears less bot-like
export const reallocate_active_accounts = async (percentageActive: number): Promise<void> => {
    if(percentageActive <= 0 || percentageActive > 1){
        throw new Error("Invalid percentage active");
    }

    // Get all accounts
    const allAccounts = await prisma.accounts.findMany({
        where: {
            state: {
                in: [AccountState.Active, AccountState.OutOfRotation]
            }
        }
    });

    const numSamples = allAccounts.length - Math.floor(allAccounts.length * percentageActive);
    console.log(`Choosing ${numSamples} account(s) to be active`);
    const allocatedActiveAccounts = sampleSize(allAccounts, numSamples);
    const allocatedOutOfRotationAccounts = difference(allAccounts, allocatedActiveAccounts);

    const activeIds = allocatedActiveAccounts.map(account => account.id)
    const oorIds = allocatedOutOfRotationAccounts.map(account => account.id)

    console.log(`Accounts Allocated Active:`)
    console.log(activeIds)
    console.log(`Accounts Allocated OOR:`)
    console.log(oorIds)

    // Update in DB
    if(activeIds.length > 0){
        await prisma.accounts.updateMany({
            where: {
                id: {
                    in: activeIds,
                }
            },
            data: {
                state: AccountState.Active,
            }
        })
    }
    
    if(oorIds.length > 0) {
        await prisma.accounts.updateMany({
            where: {
                id: {
                    in: AccountState.OutOfRotation,
                }
            },
            data: {
                state: 2
            }
        })
    }
}

export const move_out_of_rotation = async (profile: Profile): Promise<void> => {
    await prisma.accounts.updateMany({
        where: {
            username: profile.username,
        },
        data: {
            state: AccountState.OutOfRotation,
        }
    })

    return;
}