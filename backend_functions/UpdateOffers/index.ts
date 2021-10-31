import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
import { getOffers, login, validateToken } from "../src/McdApi";
import { Offer, Profile, Token } from "../src/interfaces";

const client = new CosmosClient(process.env['CosmosDbConnectionString']);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const accountId = req.query.accountId;

  if (!accountId) {
    context.res = {
      status: 400,
      body: "No account ID given"
    }
    return;
  };

  const accountsDatabase = await client.databases.createIfNotExists({ id: "Accounts" });
  const accountsContainer = await accountsDatabase.database.containers.createIfNotExists({ id: "Accounts" });

  // Lookup account by ID
  const querySpec = {
    query: "SELECT * FROM Accounts a WHERE a.id = @accountid",
    parameters: [
      {
        name: "@accountid",
        value: accountId
      }
    ]
  };
  const { resources: results } = await accountsContainer.container.items.query(querySpec).fetchAll();

  if (results.length === 0) {
    context.res = {
      status: 400,
      body: "No account found for the given ID"
    }
    return;
  }

  const account = results[0]

  const profile = {
    username: account.email,
    password: account.password
  } as Profile;

  try {
    // See if account has access token, token is less than 30 minutes old
    const tokenAlreadyExists = (account.accessToken && new Date().getTime() - account.lastLogin < 1000*60*30)

    // If token exists, validate it
    const tokenValid = tokenAlreadyExists ? await validateToken(account.accessToken) : false;

    context.log(`Profile ${account.id} - token already exists: ${tokenAlreadyExists}, token valid: ${tokenValid}`)

    // Use existing token or login and store the token
    const token = (tokenAlreadyExists && tokenValid) ? { accessToken: account.accessToken, refreshToken: account.refreshToken} as Token : await loginAndStoreToken(profile, account, accountsContainer.container);

    // Get the offers for this account using the token
    const offers = await getOffers(accountId, token.accessToken);
    context.log(`Profile ${account.id} - got ${offers.length} offers`)

    // Store offers in Db
    const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
    const offersContainer = await offersDatabase.database.containers.createIfNotExists({ id: "Offers" });

    await storeOffers(account.id, offers, offersContainer.container);
  } catch (e) {
    context.res = {
      status: 500,
      body: e.message 
    }
  } 
};

const storeOffers = async(accountId: string, offers: Offer[], dbContainer: any): Promise<void> => {
  const offersUpdate = {
    id: accountId,
    offers: offers
  }

  await dbContainer.items.upsert(offersUpdate);

  return;
}

const loginAndStoreToken = async (profile: Profile, account: any, dbContainer: any): Promise<Token> => {
  const token = await login(profile);

  const accountUpdate = {
    ...account,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    lastLogin: new Date().getTime()
  }

  await dbContainer.items.upsert(accountUpdate);

  return token;
}

export default httpTrigger;