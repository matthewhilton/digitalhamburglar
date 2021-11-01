import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
import { randomBytes } from "crypto";
import { getOfferClaims, getSavedOffer } from "../src/offers";
import { ServiceBusClient } from "@azure/service-bus";

const client = new CosmosClient(process.env['CosmosDbConnectionString']);
const serviceBusClient = new ServiceBusClient(process.env['ServiceBusUpdateAccountOffers']);
const serviceBusQueue = "accountupdates";

const sender = serviceBusClient.createSender(serviceBusQueue);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const offerHash = req.query.offerHash;

  if (!offerHash) {
    context.res = {
      status: 400,
      body: "No offer hash given"
    }
    return;
  };

  const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
  const offersContainerResponse = await offersDatabase.database.containers.createIfNotExists({ id: "Offers" });
  const offersContainer = offersContainerResponse.container;

  // Lookup offer hash to verify if offer exists
  try {
    const offer = await getSavedOffer(offerHash, offersContainer);

    if (!offer) throw new Error("No offer found for given offer hash")

    // See if there is already a claim on this offer from another user
    const offersClaimsContainerResponse = await offersDatabase.database.containers.createIfNotExists({ id: "OfferClaims" });
    const offersClaimsContainer = offersClaimsContainerResponse.container;

    // Get existing claims
    const existingClaims = await getOfferClaims(offer.hash, offersClaimsContainer);

    // If a claim exists and at least one is not expired, don't allow new claim
    if (existingClaims.length != 0 && existingClaims.some(claim => Date.now() < claim.expiry)) throw new Error("Offer already claimed.")

    // Else generate and save a claim and return to user
    const newOfferClaim = {
      id: randomBytes(32).toString('hex'),
      offerHash: offerHash,
      expiry: new Date().getTime() + 1000 * 60 * 5 // expires in 5 minutes time
    }

    await offersClaimsContainer.items.upsert(newOfferClaim);

    // Send a message to a service bus to update the accounts offers in 5 minutes time (to check if the offer was actually redeemed or not)
    sender.scheduleMessages({
      body: {
      accountId: offer.accountId
    }}, new Date(new Date().getTime() + 1000 * 60 * 5))

    context.res = {
      body: newOfferClaim
    }

  } catch (e) {
    context.res = {
      status: 500,
      body: e.message
    }
    return;
  }
};

export default httpTrigger;