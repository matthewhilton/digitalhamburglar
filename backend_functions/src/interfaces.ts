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

export interface Token {
    accessToken: string,
    refreshToken: string
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
    hash: string
}