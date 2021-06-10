import { AccountState, get_token_for_account } from "./loginmanager";
import { ApiOffer, Offer, OfferCode, Profile, Token } from "./interfaces";
import { getAccountOffers, redeemOffer } from "./mcdapi";
import { PrismaClient } from '@prisma/client'
import { flatten, differenceWith, map } from "lodash";
import crypto from 'crypto';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

dotenv.config()

export enum OfferState {
    available = 1,
    temporarily_redeemed = 2,
}

export const get_account_offers = async (profile?: Profile , token?: Token): Promise<Offer[]> => {
    // Check parameters
    if(profile === undefined && token === undefined){
        throw new Error("Neither profile nor token was given, one is required");
    }

    // Get token if given account
    if(profile !== undefined && token === undefined){
        token = await get_token_for_account(profile);
    }

    if(token === undefined){
        throw new Error("Could't get token to get account offers");
    }

    return getAccountOffers(token);
}

export const get_offer_by_id = async (id: number): Promise<Offer> => {
    const dboffer = await prisma.offers.findFirst({
        where: {
            id: id,
        }
    })
    if(dboffer === null) throw new Error("Could not find offer")

    return translate_to_offer(dboffer);
}

export const obtain_every_account_offers = async(): Promise<void> => {
    // Get every account that is in rotation
    const allAccounts = await prisma.accounts.findMany({
        where: {
            state: AccountState.Active
        }
    });

    // For each account, get the account offers 
    const accountOfferPromises = allAccounts.map(account => get_account_offers(account));
    const allOffersResponses = await Promise.all(accountOfferPromises);
    const allOffers = flatten(allOffersResponses);

    // Save all the offers to the DB
    await save_entire_offers(allOffers);

    console.log("Successfully obtained and aligned all offers with the DB.")
}

// Compare offers by the combination of their accountid, propositionid and offerid 
// As offers from the McdAPI don't have IDs (although, offerID is likely an id but not always*), this ensures they are all uniquely identified
const offerCompare = (a: Offer, b: Offer): boolean => {
    if(a.profile === null || b.profile === null) return false;
    return(a.profile.id === b.profile.id && a.offerid === b.offerid && a.propositionid === b.propositionid)
}


export const save_entire_offers = async(offers: Offer[]): Promise<void> => {
    const currentDBOffers = await prisma.offers.findMany();
    const currentOffers = await Promise.all(currentDBOffers.map(translate_to_offer))

    // Filter out the bad offers that can't be used
    offers = offers.filter(bad_offers_filter)

    // See if there are any new offers (create them)
    const newOffers = differenceWith(offers, currentOffers, offerCompare)
    console.log("New Offers:")
    console.log(map(newOffers, 'title'))

    // See if any offers are gone (delete them)
    const removedOffers = differenceWith(currentOffers, offers, offerCompare)
    console.log("Removed Offers:")
    console.log(map(removedOffers, 'title'))

    // For each new offer, create new offer query
    const offerCreationQueries = newOffers.map(offer => prisma.offers.create({
        data: {
            offerid: offer.offerid,
            propositionid: offer.propositionid,
            title: offer.title,
            description: offer.longDescription,
            image: offer.image,
            offerbucket: offer.offerBucket,
            accountid: offer.profile.id || -1,
            validto: offer.validto,
            state: offer.state
        }
    }))

    // For each removed offer, make a deletion query
    const offerDeletionQueries = removedOffers.map(offer => prisma.offers.delete({
        where: {
            id: offer.id
        }
    }))

    // Run a transaction, deleting all offers and adding the new ones
    await prisma.$transaction([
        ...offerDeletionQueries,
        ...offerCreationQueries
    ])
}

// Filters offers that cant be used (such as punchcard rewards)
export const bad_offers_filter = (offer: Offer): boolean => {
   if(offer.offerBucket === 'PunchcardReward') {
       return false
   }

   return true;
}

export const get_all_offers = async () : Promise<Offer[]> => {
    const offers = await prisma.offers.findMany();
    return Promise.all(offers.map(translate_to_offer))
}

// Converts DB offer to Offer interface
export const translate_to_offer = async (offer): Promise<Offer> => {
    // Get profile from DB
    const profile = await prisma.accounts.findFirst({
        where: {
            id: offer.accountid
        }
    })

    return {
        id: offer.id || null,
        offerid: offer.offerid,
        propositionid: offer.propositionid,
        title: offer.title,
        longDescription: offer.description,
        image: offer.image,
        offerBucket: offer.offerbucket,
        validto: offer.validto,
        state: offer.state,
        profile: profile ? {
            username: profile.username,
            password: profile.password,
            id: profile.id,
            state: profile.state,
        } : null
    }
}

export const temp_redeem_offer = async (offer: Offer, timeoutSeconds: number): Promise<void> => {
    if(offer.id === null) throw new Error("Offer ID cannot be null.");

    await prisma.offers.update({
        where: {
            id: offer.id
        },
        data: {
            state: OfferState.temporarily_redeemed
        }
    })

    console.log(`Offer ${offer.id} temporarily redeemed`)
    
    // Set a timeout to change it back to available.
    setTimeout(async (offer) => {
        console.log(`Verifying status of offer ${offer.id}`)
        // Check if offer has actually been redeemed by querying the API
        const accountToken = await get_token_for_account(offer.profile);
        const accountOffers = await getAccountOffers(accountToken);

        // See if offer is in the offers for this account
        const offerStillValid = differenceWith(accountOffers, [offer], offerCompare).length === 1;

        if(offerStillValid){
            console.log("Offer was not redeemed, making available again...")
            await prisma.offers.update({
                where: {
                    id: offer.id
                },
                data: {
                    state: OfferState.available
                }
            })
        } else {
            // Offer was redeemed - delete it
            console.log("Offer was redeemed, deleting...")
            await prisma.offers.delete({
                where: {
                    id: offer.id
                }
            })
        }
    }, timeoutSeconds * 1000, offer)
}

const algorithm = 'aes-128-ecb';
const key = Buffer.from(process.env.SECRET_KEY || "8CBDEC62EB4DCA778F842B02503011B2", "hex")

export const encryptToken = async (text: string): Promise<string> => {
    var cipher = crypto.createCipheriv(algorithm, key, null);  
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

export const decryptToken = async (encrypted: string): Promise<string> => {
    var decipher = crypto.createDecipheriv(algorithm, key, null);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}

const get_offer_token = async (offer: Offer): Promise<string> => {
    const offerTokenUnencrypted = String(offer.id) + '|' + String(offer.offerid) + '|' + String(offer.propositionid) + '|' + String(offer.profile ? offer.profile.id : 'null')
    return await encryptToken(offerTokenUnencrypted)
}

// Converts offer into ApiOffer 
export const convert_offer_for_api = async (offer: Offer): Promise<ApiOffer> => {
    const offerToken = await get_offer_token(offer);
    return {
        title: offer.title,
        longDescription: offer.longDescription,
        image: offer.image,
        validto: offer.validto,
        offertoken: offerToken 
    } as ApiOffer;
}

export const redeem_offer = async (offerToken: string): Promise<OfferCode> => {
    const offerTokenDecrypted = await decryptToken(offerToken)
    const offerId = Number(offerTokenDecrypted.split('|')[0])
    const offer = await get_offer_by_id(offerId)

    if(offer.profile === null) throw new Error("Could not get account for offer")

    const accountToken = await get_token_for_account(offer.profile)

    // Get offer code
    const offerCode = await redeemOffer(offer.offerid, offer.propositionid, accountToken)
    
    // Mark offer as temporarily redeemed
    await temp_redeem_offer(offer, Number(process.env.OFFER_TEMP_REDEMPTION_TIME) || 30)

    return offerCode;
}