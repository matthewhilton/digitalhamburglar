export interface Profile {
    email: string,
    password: string,
    id: string
}

export interface Device {
    deviceId: string,
    os: string,
    osVersion: string,
    deviceIdType: string,
    isActive: string,
    timezone: string
}

export interface Token {
    accessToken: string,
    refreshToken: string,
    lastLogin: number
}

export interface Offer {
    id: number,
    propositionId: number,
    name: string, 
    shortDescription: string, 
    longDescription: string, 
    offerBucket: string, 
    validToUTC: string,
    profileId: string,
    hash: string,
    accountId: string,
    image: string
}

export interface OfferClaim {
    id: number,
    expiry: number,
    offerHash: string,
    claimKey: string
}

export interface OfferCode {
    code: string,
    barcodeData: string,
    expirationTime: string,
}