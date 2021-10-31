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