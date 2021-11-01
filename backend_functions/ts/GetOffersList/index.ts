import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    const client = new CosmosClient(process.env['CosmosDbConnectionString']);
    const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
    const offersContainerReponse = await offersDatabase.database.containers.createIfNotExists({ id: "Offers" });
    const offersContainer = offersContainerReponse.container;

    const { resources: documents }  = await offersContainer.items.readAll().fetchAll();

    const accountOffers = documents.map(doc => doc.offers);
    const offers = accountOffers.flat();

    // Clean off the unnecessary information
    const offersSanitised = offers.map(({ name, shortDescription, longDescription, validToUTC, image, hash }) => ({ name, shortDescription, longDescription, validToUTC, image, hash }));

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: offersSanitised
    };

};

export default httpTrigger;