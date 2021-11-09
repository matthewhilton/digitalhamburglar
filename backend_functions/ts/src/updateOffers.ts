import { CosmosClient } from "@azure/cosmos";
import { getAccountById, getAndCacheAccountToken } from "./accounts";
import { Offer } from "./interfaces";
import { getOffers } from "./McdApi";


const updateAccountOffers = async (accountId: string) => {
    const client = new CosmosClient(process.env['CosmosDbConnectionString']);

    const accountsDatabase = await client.databases.createIfNotExists({ id: "Accounts" });
    const accountsContainerResponse = await accountsDatabase.database.containers.createIfNotExists({ id: "Accounts" });
    const accountsContainer = accountsContainerResponse.container;

    const accountProfile = await getAccountById(accountId, accountsContainer);
    const token = await getAndCacheAccountToken(accountId, accountsContainer);

    // Get the offers for this account using the token
    const offers = await getOffers(accountId, token.accessToken);
    console.log(`Profile ${accountProfile.id} - got ${offers.length} offers`)

    // Store offers in Db
    const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
    const offersContainer = await offersDatabase.database.containers.createIfNotExists({ id: "Offers" });

    await storeOffers(accountProfile.id, offers, offersContainer.container);
}


const storeOffers = async (accountId: string, offers: Offer[], dbContainer: any): Promise<void> => {
    const offersUpdate = {
        id: accountId,
        offers: offers
    }

    await dbContainer.items.upsert(offersUpdate);

    return;
}

export default updateAccountOffers;