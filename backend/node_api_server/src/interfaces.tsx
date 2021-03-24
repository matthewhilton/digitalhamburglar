
export interface Offer extends SimpleOffer {
    id: number | null,
    mcd_offerId: number,
    mcd_propositionId: number,
    longDescription: string, 
    validToUTC: string,
    profile: Profile,
}

export interface SimpleOffer {
    externalId: string | null,
    title: string,
    offerBucket: string, 
    image: string,
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