import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";

const client = new CosmosClient(process.env['CosmosDbConnectionString']);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    
    const { database } = await client.databases.createIfNotExists({ id: "Offers" });
    const { container } = await database.containers.createIfNotExists({ id: "Offers" });

    await container.items.create({
        message: "it works!"
    });

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Done"
    };

};

export default httpTrigger;