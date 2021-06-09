import { Profile, Token } from "./interfaces";
import { PrismaClient } from '@prisma/client'
import { login, refreshToken } from "./mcdapi";
const prisma = new PrismaClient();

export const get_token_for_account = async (profile: Profile): Promise<Token> => {
    // Lookup by username as username is unique
    const user = await prisma.accounts.findFirst({
        where: {
            username: profile.username,
        }
    })

    if(user === null){
        // User hasn't been logged in - try and log in and save the token
        return reset_account_token(profile)
    }

    const usersToken = <Token> {
        accessToken: user.accesstoken,
        refreshToken: user.refreshtoken
    }

    // User has logged in sometime in the past, check how long ago to see if token can be reused.
    const hoursBetweenDates = (new Date().getTime() - user.tokenlastchecked.getTime()) / (1000 * 60 * 60)

    // Use tokens if they are about less than an hour old
    if(hoursBetweenDates < 0.9){
        return usersToken
    }

    // Else token is old and needs to be refreshed
    const refreshedToken = await refreshToken(usersToken);
    return refreshedToken;
}

export const reset_account_token = async (profile: Profile): Promise<Token> => {
    // Get brand new token and save to DB
    const token = await login(profile);
    const data = {
        username: profile.username,
        password: profile.password,
        accesstoken: token.accessToken,
        refreshtoken: token.refreshToken,
        tokenlastchecked: new Date()
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