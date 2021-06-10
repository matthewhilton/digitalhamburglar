import { get_token_for_account } from "./loginmanager";
import { Offer, Profile, Token } from "./interfaces";
import { getAccountOffers } from "./mcdapi";

export const get_account_offers = async (profile?: Profile , token?: Token): Promise<[Offer]> => {
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

export const save_offers = async(offers: [Offer]): Promise<void> => {
    
}