import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import wretch from "wretch"
import { retry, delay } from 'wretch-middlewares'
import { Profile, Token, Offer, OfferCode } from 'interfaces';
import { get_profile_db } from './loginmanager';
import { OfferState } from './offersmanager';

// Fixed credentials...
const clientSecret = "anr4rTy2VRaCfcr9wZE6kVKjSswTv2Rc"
const clientId = "724uBz3ENHxUMrWH73pekFvUKvj8fD7X"

wretch().polyfills({
    fetch: require("node-fetch"),
    FormData: require("form-data"),
    URLSearchParams: require("url").URLSearchParams
})

export const getRandomMcdUUID = ():string => {
    return crypto.randomBytes(8 / 2).toString('hex')
        + "-"
        + crypto.randomBytes(4 / 2).toString('hex')
        + "-"
        + crypto.randomBytes(4 / 2).toString('hex')
        + "-"
        + crypto.randomBytes(4 / 2).toString('hex')
        + "-"
        + crypto.randomBytes(12 / 2).toString('hex')
}

export const get_bearer_unauth = (): Promise<string> => {
    // Encode the clientID and client secret in base64
    let buff = Buffer.from(clientId + ":" + clientSecret, "utf-8");
    const base64encoded = buff.toString('base64')
    const basicAuthToken = "Basic " + base64encoded;

    // Get a bearer token (not authenticated, but just to identify requests)
    return new Promise((resolve, reject) => {
        wretch()
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
            resolve(json.response.token)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const login = (profile: Profile, deviceId = uuidv4(), type="email", mcdUUID=getRandomMcdUUID()) : Promise<Token> =>{
    return new Promise((resolve, reject) => {
        get_bearer_unauth().then(unauth_token => {
            wretch()
            .url("https://ap-prod.api.mcd.com/exp/v1/customer/login")
            .headers({
                'authorization': 'Bearer ' + unauth_token,
                'content-type': 'application/json',
                'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
                'accept': '*/*',
                'connection': 'keep-alive',
                'mcd-clientid': clientId,
                'mcd-clientsecret': clientSecret,
                'mcd-sourceapp': 'GMA',
                'mcd-marketid': 'AU',
                'accept-encoding': 'gzip;q=1.0, *;q=0.5',
                'mcd-uuid': mcdUUID,
                'cache-control': 'true',
                'accept-language': 'en-AU'
            })
            .body(JSON.stringify({
                "credentials": {
                    "loginUsername": profile.username,
                    "password": profile.password,
                    "type": type
                },
                "deviceId": deviceId
            }))
            .post()
            .json(json => {
                console.log(json)

                if(json.status.code == 40000){
                    reject(json.status)
                }

                resolve(json.response as Token)
            })
            .catch(err => reject(err))
        }).catch(err => reject(err))
    })
}

export const refreshToken = (token: Token, mcdUUID = getRandomMcdUUID()): Promise<Token> => {
    return new Promise((resolve, reject) => {
        wretch()
            .url("https://ap-prod.api.mcd.com/exp/v1/customer/login/refresh")
            .headers({
                'authorization': 'Bearer ' + token.accessToken,
                'mcd-clientid': clientId,
                'mcd-clientsecret': clientSecret,
                'Content-Type': 'application/json',
                'mcd-marketid': 'AU',
                'accept-language': 'en-AU',
                'accept': 'application/json',
                'mcd-sourceapp': 'GMA',
                'mcd-uuid': mcdUUID
            })
            .post({"refreshToken": token.refreshToken})
            .json(json => {

                if(json.status.code === 20000){
                    resolve(json.response as Token)
                }

                // Else reject
                reject(json.status)
            })
            .catch(err => reject(err))
    })
}

export const getAccountOffers = (token: Token): Promise<Offer[]> => {
    return new Promise(async (resolve, reject) => {
        const accountForToken = await get_profile_db(token);
        
        wretch()
        .url("https://ap-prod.api.mcd.com/exp/v1/offers")
        .headers({
            'authorization': 'Bearer ' + token.accessToken,
            'mcd-clientid': clientId,
            'accept-language': "en-AU",
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
        })
        .get()
        .json(json => {
            // Restructure them into the Offer interfacejson.response.offers.map(offer => {
            const offersReceived = json.response.offers.map(offer => {
                const receivedOffer: Offer = {
                    id: null,
                    offerid: offer.offerId,
                    propositionid: offer.offerPropositionId,
                    title: offer.name,
                    longDescription: offer.longDescription,
                    offerBucket: offer.offerBucket,
                    validto: new Date(offer.validToUTC),
                    image: offer.imageBaseName,
                    profile: accountForToken,
                    state: OfferState.available,
                }
                return receivedOffer
            })

            resolve(offersReceived)
        })
        .catch(err => reject(err))
    })
}

export const testToken = (token: Token, mcdUUID=getRandomMcdUUID()): Promise<Boolean> => {
    return new Promise<Boolean>((resolve, reject) => {
        // Tests a given token for expiry by accessing the profile endpoint
        wretch()
        .url("https://ap-prod.api.mcd.com/exp/v1/customer/profile")
        .headers({
            'authorization': 'Bearer ' + token.accessToken,
            'mcd-clientid': clientId,
            'mcd-clientsecret': clientSecret,
            'accept-language': "en-AU",
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
            'mcd-uuid': mcdUUID,
            'mcd-sourceapp': 'GMA',
        })
        .get()
        .json(json => {
            if(json.status.code === 20000) resolve(true);
            resolve(false)
        })
        .catch(err => {
            console.log('Token validation failed')
            console.log(err)
            resolve(false)
        })
    })
}

export const redeemOffer = (mcd_offerId: number, mcd_propId: number, accountToken: Token): Promise<OfferCode> => {
    return new Promise<OfferCode>((resolve, reject) => {
        let url = 'https://ap-prod.api.mcd.com/exp/v1/offers/redemption/' + String(mcd_propId)

        // Sometimes an offerID is zero, if this is the case do not append it to the end or else it causes errors 
        if(mcd_offerId != 0){
            url = url + "?offerId=" + String(mcd_offerId)
        }

        wretch(url)
        .headers({ 
            'Authorization': 'Bearer ' + accountToken.accessToken,
            'mcd-clientid': clientId,
            'Accept-Language': 'en-AU', 
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
        })
        .get()
        .json(json => {
            const offerCodeData: OfferCode = {
                code: json.response.randomCode,
                barcodeData: json.response.barCodeContent,
                expirationTime: json.response.expirationTime
            }
            resolve(offerCodeData);
        })
        .catch(err => reject(err))
})
}