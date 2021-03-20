
export interface Offer {
    id: number | null,
    mcd_offerId: number,
    mcd_propositionId: number,
    name: string, 
    shortDescription: string, 
    longDescription: string, 
    offerBucket: string, 
    validToUTC: string,
    profile: Profile,
}

export interface SanitisedOffer {
    id: number,
    propositionId: number,
    name: string, 
    shortDescription: string, 
    longDescription: string, 
    offerBucket: string, 
    validToUTC: string,
}

export interface OfferCode {
    code: string,
    barcodeData: string,
    expirationTime: string,
}

export interface Profile {
    username: string,
    password: string,
    created: Date,
    id: number
}

export interface Device {
    deviceId: string,
    os: string,
    osVersion: string,
    deviceIdType: string,
    isActive: string,
    timezone: string
}