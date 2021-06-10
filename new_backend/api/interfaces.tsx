
export interface Offer {
    id: number | null,
    offerid: number,
    propositionid: number,
    title: string,
    offerBucket: string,
    image: string,
    longDescription: string, 
    validto: Date,
    profile: Profile
}

export interface OfferCode {
    code: string,
    barcodeData: string,
    expirationTime: string,
}

export interface Profile {
    username: string,
    password: string,
    accesstoken?: string,
    refreshtoken?: string,
    id?: number
    state: number,
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
}