import { Container } from "@azure/cosmos";
import { Profile, Token } from "./interfaces";
import { login, validateToken } from "./McdApi";

export const getAccountById = async (accountId: string, dbContainer: Container): Promise<Profile> => {
    // Lookup account by ID
    const accountQuerySpec = {
        query: "SELECT * FROM Accounts a WHERE a.id = @accountid",
        parameters: [
            {
                name: "@accountid",
                value: accountId
            }
        ]
    };
    const { resources: accountResults } = await dbContainer.items.query(accountQuerySpec).fetchAll();

    if (accountResults.length === 0) throw new Error("No account found.");

    const account = {
        email: accountResults[0].email,
        password: accountResults[0].password,
        id: accountResults[0].id,
    } as Profile;

    return account;
}

export const getAllAccountIds = async (dbContainer: Container): Promise<string[]> => {
    const { resources: accountResults } = await dbContainer.items.readAll().fetchAll();

    return accountResults.map(result => result.id);
}

export const getAccountToken = async (accountId: string, dbContainer: Container): Promise<Token> => {
    const accountTokenQuerySpec = {
        query: "SELECT * FROM Accounts a WHERE a.id = @accountid",
        parameters: [
            {
                name: "@accountid",
                value: accountId
            }
        ]
    }
    const { resources: accountResults } = await dbContainer.items.query(accountTokenQuerySpec).fetchAll();

    if (accountResults.length === 0) throw new Error("No account found.");

    const token = {
        accessToken: accountResults[0].accessToken,
        refreshToken: accountResults[0].refreshToken,
        lastLogin: accountResults[0].lastLogin,
    } as Token;

    return token;
}

export const saveToken = async (profile: Profile, accountId: string, token: Token, dbContainer: Container): Promise<Token> => {
    const accountUpdate = {
        ...profile,
      id: accountId,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      lastLogin: new Date().getTime()
    }
  
    await dbContainer.items.upsert(accountUpdate);
  
    return token;
  }

export const getAndCacheAccountToken = async(accountId: string, dbContainer: Container): Promise<Token> => {
    // Get the saved token
    const savedToken = await getAccountToken(accountId, dbContainer).catch(() => {{ return null }});

    // Validate token if saved
    const tokenValid = savedToken ? await validateToken(savedToken.accessToken) : false;

    console.log(`Account ID ${accountId} - saved token: ${savedToken !== null}, token valid: ${tokenValid}`);

    // Return token if valid
    if(tokenValid) return savedToken;

    // Token not valid - get new token
    const accountProfile = await getAccountById(accountId, dbContainer);
    const newToken = await login(accountProfile);

    // Save token.
    await saveToken(accountProfile, accountProfile.id, newToken, dbContainer);

    return newToken;
}