import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
import { getOffers, login, validateToken } from "../src/McdApi";
import { Offer, Profile, Token } from "../src/interfaces";
import { getAccountById, getAccountToken, getAndCacheAccountToken } from "../src/accounts";

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
  const accountsContainerResponse = await accountsDatabase.database.containers.createIfNotExists({ id: "Accounts" });
  const accountsContainer = accountsContainerResponse.container;
  
  try {
    const accountProfile = await getAccountById(accountId, accountsContainer);
    const token = await getAndCacheAccountToken(accountId, accountsContainer);

    // Get the offers for this account using the token
    const offers = await getOffers(accountId, token.accessToken);
    context.log(`Profile ${accountProfile.id} - got ${offers.length} offers`)

    // Store offers in Db
    const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
    const offersContainer = await offersDatabase.database.containers.createIfNotExists({ id: "Offers" });

    await storeOffers(accountProfile.id, offers, offersContainer.container);
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


export default httpTrigger;
