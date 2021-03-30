export interface OfferDetails {
    title: string,
    description: string,
    externalId: string,
    expires: string,
    image: string,
    lastchecked: string,
}

export interface ApiResponse {
    data: {} | null
    error: {} | null
}