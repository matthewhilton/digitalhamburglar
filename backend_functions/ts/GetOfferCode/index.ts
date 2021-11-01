import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
import { Offer, OfferClaim, Profile } from "../src/interfaces";
import { getAccountById, getAccountToken, getAndCacheAccountToken, saveToken } from "../src/accounts";
import { getOfferCode, login } from "../src/McdApi";
import { getOfferClaim, getSavedOffer } from "../src/offers";

const client = new CosmosClient(process.env['CosmosDbConnectionString']);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const claimKey = req.query.claimKey;

  if (!claimKey) {
    context.res = {
      status: 400,
      body: "No claim key given"
    }
    return;
  };

  const offersDatabase = await client.databases.createIfNotExists({ id: "Offers" });
  const offerClaimsContainerResponse = await offersDatabase.database.containers.createIfNotExists({ id: "OfferClaims" });
  const offerClaimsContainer = offerClaimsContainerResponse.container;

  const offersContainerResponse = await offersDatabase.database.containers.createIfNotExists({ id: "Offers" });
  const offersContainer = offersContainerResponse.container;

  const accountsDatabase = await client.databases.createIfNotExists({ id: "Accounts" });
  const accountsContainerResponse = await accountsDatabase.database.containers.createIfNotExists({ id: "Accounts" });
  const accountsContainer = accountsContainerResponse.container;

  try {
    // Find the claim
    const offerClaim = await getOfferClaim(claimKey, offerClaimsContainer);

    if (offerClaim === null) throw new Error("Offer claim not found");
    if (Date.now() > offerClaim.expiry) throw new Error("Offer claim expired");

    // Get the offer 
    const offer = await getSavedOffer(offerClaim.offerHash, offersContainer);

    if(offer === null) throw new Error("Offer claim valid, but offer not found");

    // Get a valid token for the offers' account
    const accountToken = await getAndCacheAccountToken(offer.accountId, accountsContainer);

    if(accountToken === null) throw new Error("Could not get account token.");

    // Get offer code from MCD api
    const offerCode = await getOfferCode(offer.id, offer.propositionId, accountToken.accessToken);

    // Return offer code
    context.res = {
      body: offerCode
    }
    return;

  } catch (e) {
    context.res = {
      status: 500,
      body: e.message
    }
    return;
  }
};

export default httpTrigger;