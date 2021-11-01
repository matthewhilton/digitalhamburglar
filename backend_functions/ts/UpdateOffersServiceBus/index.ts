import { AzureFunction, Context } from "@azure/functions"
import updateAccountOffers from "../src/updateOffers";

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, message: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message', message);

    const accountId = message.accountId;

    if(!accountId) {
        context.res = {
            status: 400,
            body: "No account ID given in message"
        }
    }

    // Update offers for this account
    try {
        await updateAccountOffers(accountId)
    } catch(e) {
        context.res = {
            status: 500,
            body: e.message
        }
    }
}

export default serviceBusQueueTrigger;
