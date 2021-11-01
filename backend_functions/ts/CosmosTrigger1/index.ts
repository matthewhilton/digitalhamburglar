import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context } from "@azure/functions"

const cosmosDBTrigger: AzureFunction = async function (context: Context, documents: any[]): Promise<void> {
    
    const client = new CosmosClient(process.env['CosmosDbConnectionString']);
    const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
    const offersLeasesContainerResponse = await offersDatabase.database.containers.createIfNotExists({ id: "offersLeases" });
    const offersLeasesContainer = offersLeasesContainerResponse.container;

    // Find which accounts had the offers updated
    const affectedAccounts = documents.map(doc => doc.id)

    // Get the offer hashes from the affected accounts in the offers leases container
    const affectedOffers = await Promise.all(affectedAccounts.map(async accountId => {
        const affectedOffersQuery = {
            query: "SELECT * FROM offersLeases WHERE accountId=@accountid",
            parameters: [
                {
                    name: "@accountid",
                    value: accountId
                }
            ]
        };
    
        const { resources: results } = await offersLeasesContainer.items.query(affectedOffersQuery).fetchAll();
        return results;
    }))
    

    if (!!documents && documents.length > 0) {
        context.log('Document Id: ', documents[0].id);
    }
}

export default cosmosDBTrigger;
