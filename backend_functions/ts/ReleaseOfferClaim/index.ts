import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
import { getOfferClaim } from "../src/offers";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const client = new CosmosClient(process.env['CosmosDbConnectionString']);
    const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
    const offerClaimsDatabase = await offersDatabase.database.containers.createIfNotExists({ id: "OfferClaims" });
    const offerClaimsContainer = offerClaimsDatabase.container;

    const claimKey = req.query.claimKey;

    if (!claimKey) {
        context.res = {
            status: 400,
            body: "No claim key given"
        }
        return;
    };

    try {
        // Find the offer claim
        const offerClaim = await getOfferClaim(claimKey, offerClaimsContainer);

        if (offerClaim === null) throw new Error("Offer claim not found");

        // Delete the offer claim
        await offerClaimsContainer.item(offerClaim.id, offerClaim.id).delete()

        context.res = {
            status: 200,
        }

        return;
    } catch (e) {
        context.res = {
            status: 500,
            body: e.message
        };
    }
};

export default httpTrigger;