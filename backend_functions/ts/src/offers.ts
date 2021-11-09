import { Container } from "@azure/cosmos";
import { Offer, OfferClaim } from "./interfaces";


export const getSavedOffer = async (offerHash: string, dbContainer: Container): Promise<Offer | null> => {
    const querySpec = {
        query: "SELECT * FROM o IN Offers.offers WHERE o.hash = @offerhash",
        parameters: [
            {
                name: "@offerhash",
                value: offerHash
            }
        ]
    };

    const { resources: results } = await dbContainer.items.query(querySpec).fetchAll();

    if (results.length == 0) return null;

    return results[0] as Offer;
}

export const getOfferClaims = async (offerHash: string, dbContainer: Container): Promise<OfferClaim[]> => {
    const queryOfferClaimSpec = {
        query: "SELECT * FROM OfferClaims c WHERE c.offerHash = @offerhash",
        parameters: [
            {
                name: "@offerhash",
                value: offerHash
            }
        ]
    };
    const { resources: offerClaimResults } = await dbContainer.items.query(queryOfferClaimSpec).fetchAll();

    return offerClaimResults.map(claim => ({
        id: claim.id,
        expiry: claim.expiry,
        offerHash: offerHash,
        claimKey: claim.id
    } as OfferClaim))
}

export const getOfferClaim = async(offerClaim: string, dbContainer: Container): Promise<OfferClaim> => {
    const queryOfferClaimSpec = {
        query: "SELECT * FROM OfferClaims c WHERE c.id = @claim",
        parameters: [
            {
                name: "@claim",
                value: offerClaim
            }
        ]
    };
    const { resources: offerClaimResults } = await dbContainer.items.query(queryOfferClaimSpec).fetchAll();

    if(offerClaimResults.length === 0) return null;

    return {
        id: offerClaimResults[0].id,
        expiry: offerClaimResults[0].expiry,
        offerHash: offerClaimResults[0].offerHash,
        claimKey: offerClaimResults[0].id
    } as OfferClaim
}