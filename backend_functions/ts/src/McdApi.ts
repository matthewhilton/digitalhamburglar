import { randomBytes, createHash } from "crypto";
import wretch from "wretch";
import { retry } from 'wretch-middlewares'
import { v4 as uuidv4 } from 'uuid';
import { Offer, OfferCode, Profile, Token } from "./interfaces";
import "isomorphic-fetch"

const clientId = "724uBz3ENHxUMrWH73pekFvUKvj8fD7X";
const clientSecret = "anr4rTy2VRaCfcr9wZE6kVKjSswTv2Rc";

export const getRandomMcdUUID = (): string => {
    return randomBytes(8 / 2).toString('hex')
        + "-"
        + randomBytes(4 / 2).toString('hex')
        + "-"
        + randomBytes(4 / 2).toString('hex')
        + "-"
        + randomBytes(4 / 2).toString('hex')
        + "-"
        + randomBytes(12 / 2).toString('hex')
}

export const get_bearer_unauth = async (): Promise<string | null> => {
    // Encode the clientID and client secret in base64
    let buff = Buffer.from(clientId + ":" + clientSecret, "utf-8");
    const base64encoded = buff.toString('base64')
    const basicAuthToken = "Basic " + base64encoded;

    // Get a bearer token (not authenticated, but just to identify requests)
    return await wretch()
        .middlewares([
            retry({
                maxAttempts: 3,
                delayTimer: 150
            })
        ])
        .url("https://ap-prod.api.mcd.com/v1/security/auth/token")
        .headers({
            'authorization': basicAuthToken,
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
            'accept': '*/*',
            'connection': 'keep-alive',
        })
        .body("grantType=client_credentials")
        .post()
        .json((json) => {
            return json.response.token
        })
}

export const login = async (profile: Profile, deviceId = uuidv4(), type="email") : Promise<Token | null> => {
    const unauthToken = await get_bearer_unauth();

    return await wretch()
        .url("https://ap-prod.api.mcd.com/exp/v1/customer/login")
        .headers({
            'authorization': 'Bearer ' + unauthToken,
            'content-type': 'application/json',
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
            'accept': '*/*',
            'connection': 'keep-alive',
            'mcd-clientid': clientId,
            'mcd-clientsecret': clientSecret,
            'mcd-sourceapp': 'GMA',
            'mcd-marketid': 'AU',
            'accept-encoding': 'gzip;q=1.0, *;q=0.5',
            'mcd-uuid': getRandomMcdUUID(),
            'cache-control': 'true',
            'accept-language': 'en-AU'
        })
        .body(JSON.stringify({
            "credentials": {
                "loginUsername": profile.email,
                "password": profile.password,
                "type": type
            },
            "deviceId": deviceId
        }))
        .post()
        .json(json => {
            return {
                accessToken: json.response.accessToken,
                refreshToken: json.response.refreshToken,
                lastLogin: new Date().getTime()
            } as Token;
        })
}

export const getOffers = async (accountId: string, accessToken: string): Promise<Offer[]> => {
    return await wretch()
    .url("https://ap-prod.api.mcd.com/exp/v1/offers")
    .headers({
        'authorization': 'Bearer ' + accessToken,
        'mcd-clientid': clientId,
        'accept-language': "en-AU",
        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
    })
    .get()
    .json(json => {
        const offers = json.response.offers.map(offer => ({
                id: offer.offerId,
                propositionId: offer.offerPropositionId,
                name: offer.name,
                shortDescription: offer.shortDescription,
                longDescription: offer.longDescription,
                offerBucket: offer.offerBucket,
                validToUTC: offer.validToUTC,
                accountId,
                image: offer.imageBaseName,
                hash: createHash('sha256').update(offer.name + accountId).digest('hex')
            } as Offer 
        ))

        // Filter out the punchcard rewards (not supported)
        const filteredOffers = offers.filter(offer => offer.offerBucket !== "PunchcardReward");

        return filteredOffers;
    })
}

export const validateToken = async (accessToken: string): Promise<boolean> => {
    return await wretch()
        .url("https://ap-prod.api.mcd.com/exp/v1/offers")
        .headers({
            'authorization': 'Bearer ' + accessToken,
            'mcd-clientid': clientId,
            'accept-language': "en-AU",
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
        })
        .get()
        .json(json => {
            return true;
        })
        .catch(err => {
            return false;
        })
}

export const getOfferCode = async (offerId: number, propositionId: number, accessToken: string): Promise<OfferCode> => {
    
    let url = `https://ap-prod.api.mcd.com/exp/v1/offers/redemption/${String(propositionId)}`
    
    // Sometimes an offerID is zero, if this is the case do not append it to the end or else it causes errors 
    if(offerId != 0){
        url += "?offerId=" + String(offerId)
    }

    return await wretch()
        .url(url)
        .headers({
            'authorization': 'Bearer ' + accessToken,
            'mcd-clientid': clientId,
            'accept-language': "en-AU",
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
        })
        .get()
        .json(json => ({
            code: json.response.randomCode,
            barcodeData: json.response.barCodeContent,
            expirationTime: json.response.expirationTime
        }) as OfferCode)
}
