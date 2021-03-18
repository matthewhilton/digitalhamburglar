
export interface Token {
    accessToken: string, 
    refreshToken: string,
}

export interface Offer {
    id: number,
    propositionId: number,
    name: string, 
    shortDescription: string, 
    longDescription: string, 
    offerBucket: string, 
    validToUTC: string,
    profile: ShortProfile,
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

export interface ShortProfile {
    username: string,
    password: string,
}

export interface Profile {
    username: string,
    password: string,
    active: boolean,
    _id: string,
}

export interface Device {
    deviceId: string,
    os: string,
    osVersion: string,
    deviceIdType: string,
    isActive: string,
    timezone: string
}