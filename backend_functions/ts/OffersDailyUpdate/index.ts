import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context } from "@azure/functions"
import { getAllAccountIds } from "../src/accounts";
import "isomorphic-fetch";
import { ServiceBusClient } from "@azure/service-bus";

const client = new CosmosClient(process.env['CosmosDbConnectionString']);
const serviceBusClient = new ServiceBusClient(process.env['ServiceBusUpdateAccountOffers']);
const serviceBusQueue = "accountupdates";

const sender = serviceBusClient.createSender(serviceBusQueue);

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);  
    
    // Get all the account ID's
    const accountsDatabase = await client.databases.createIfNotExists({ id: "Accounts" });
    const accountsContainerResponse = await accountsDatabase.database.containers.createIfNotExists({ id: "Accounts" });
    const accountsContainer = accountsContainerResponse.container;

    const allAccounts = await getAllAccountIds(accountsContainer);

    const batchMessages = allAccounts.map(accountId => ({
        body: {
            accountId
        }
    }))

    context.log("Sending batch update:")
    context.log(batchMessages)

    // Send as a batch
    await sender.sendMessages(batchMessages);
};

export default timerTrigger;
