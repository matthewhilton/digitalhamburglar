import { GraphQLClient } from "graphql-request";
import { Offer, Profile, SimpleOffer } from "./interfaces";
import { GET_ALL_ACCOUNTS, CREATE_ACCOUNT, CREATE_OFFER, GET_LIST_OFFERS_ID, DELETE_OFFER_BY_ID, GET_OFFER_SIMPLE_LIST, GET_OFFER_MCD_DETAILS, UPDATE_OFFER_CHECKED, QUERY_BY_EXTERNAL_ID } from "./queries";
import { DeleteOfferByIdInput, DeleteOfferInput, OfferInput, QueryAllOffersArgs } from "./generated/graphql"
import McdApi from "./mcdapi"
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import sha256 from 'crypto-js/sha256';

export default class ApiManager {
    gql_client: GraphQLClient;

    constructor(gql_client: GraphQLClient) {
        this.gql_client = gql_client;
    }

    randomDisposableEmail(): string {
        return crypto.randomBytes(10).toString('hex') + "@sharklasers.com";
    }


    randomCompliantPassword(): string {
        // Passwords need at least 6 letters, one uppercase and 1 number.
        return "A1"+crypto.randomBytes(3).toString('hex');
    }

    randomNameGenerator(): [string, string] {
        const firstname = crypto.randomBytes(10).toString('hex')
        const lastname = crypto.randomBytes(10).toString('hex')
        return [firstname, lastname]
    }    

    getRandomPostcode(): string {
        const postcodeSelection = [
            6901, 6843, 6762, 3557, 3558, 3515, 4341, 4341, 4312, 810, 801, 2876, 2867, 2839, 2540, 2601, 5330, 5321
        ]
        const randomPostcodeIndex = Math.floor(Math.random() * postcodeSelection.length)
        return (postcodeSelection[randomPostcodeIndex].toString())
    }

    getAllAccounts(): Promise<Profile[]> {
        return new Promise((resolve, reject) => {
            this.gql_client.request(GET_ALL_ACCOUNTS).then((response) => {
                resolve(response.allAccounts.nodes as Profile[])
            }).catch(error => reject(error))
        })
    }


    createAccount(): Promise<Profile> {
        return new Promise((resolve, reject) => {
            const username: string = this.randomDisposableEmail();
            const password: string = this.randomCompliantPassword();
            const name = this.randomNameGenerator();
            const postcode = this.getRandomPostcode();
            // TODO ensure email not in use 

            new McdApi().register_account(username, password, name[0], name[1], postcode).then((response) => {
                // Success registering with remote Api
                
                // Save the data to our DB
                this.gql_client.request(CREATE_ACCOUNT, {
                    username,
                    password,
                    created: new Date()
                }).then((response) => {
                    resolve(response.createAccount.account as Profile)
                }).catch(error => reject(error))
            }).catch(error => reject(error))
        })
    }

    save_offers(offers: Array<Offer>): Promise<void> {
        return new Promise((resolve, reject) => {
            const promise_list: Array<Promise<void>> = [];

            for(const offer of offers){
                // TODO work out how to use punchcard offers - right now they give a server error when redeeming
                if(offer.offerBucket === "PunchcardReward") {
                    console.warn("Tried to save punchard reward. Punchcard rewards are not supported. Punchcard rewards will not be saved.")
                } else {
                    const offer_to_save: OfferInput = {
                        externalId: sha256(offer.mcd_offerId + offer.mcd_propositionId + offer.profile.id).toString(),
                        title: offer.title,
                        description: offer.longDescription,
                        mcdOfferid: offer.mcd_offerId,
                        mcdPropid: offer.mcd_propositionId,
                        lastChecked: new Date(),
                        accountId: offer.profile.id,
                        expires: new Date(offer.validToUTC),
                        offerbucket: offer.offerBucket,
                        image: offer.image
                    }
    
                    promise_list.push(this.gql_client.request(CREATE_OFFER, {
                        input: offer_to_save
                    }))
                }
            }

            Promise.all(promise_list).then(() => {
                console.log("All offers saved")
                resolve()
            }).catch(error => reject(error))
        })
    }

    get_list_offer_id(): Promise<Array<{ id: string}>> {
        return new Promise((resolve, reject) => {
            this.gql_client.request(GET_LIST_OFFERS_ID).then((data) => {
                resolve(data.allOffers.nodes.map(data => data.id))
            }).catch(error => reject(error))
        })
    }

    delete_all_offers(): Promise<void> {
        return new Promise((resolve, reject) => {
            
            // Create list of mutations to run to delete offers
            this.get_list_offer_id().then((offersIdList) => {
                let promise_list: Array<Promise<void>> = []
                for(const id of offersIdList) {
                    const input: DeleteOfferByIdInput = {
                        clientMutationId: null,
                        id: id,
                    }
                    
                    promise_list.push(
                        this.gql_client.request(DELETE_OFFER_BY_ID, input)
                    )
                }
                
                // Run the deletions
                Promise.all(promise_list)
                .then(() => resolve() )
                .catch(error => reject(error))
            })
        })
    }

    get_offers_simple_list(): Promise<Array<SimpleOffer>> {
        return new Promise((resolve, reject) => {
            this.gql_client.request(GET_OFFER_SIMPLE_LIST).then((data) => {
                // Resolve by casting each recived data point into a SimpleOffer 
                resolve(data.allOffers.nodes.map(offer => {
                    const recievedOffer: SimpleOffer = {
                        externalId: offer.externalId,
                        title: offer.title,
                        offerBucket: offer.offerbucket,
                        image: offer.image
                    }
                    return recievedOffer
                }))
            }).catch(error => reject(error))
        })
    }

    get_mcd_offer_details(externalId: string): Promise<{mcd_id: number, mcd_prop_id: number, profile: Profile, id}> {
        return new Promise((resolve, reject) => {
            console.log(externalId)
            this.gql_client.request(GET_OFFER_MCD_DETAILS, {
                externalId
            }).then((data) => {
                if(data.allOffers.nodes.length == 0) {
                    reject("No offer found for the given external ID")
                } else {
                    const details = data.allOffers.nodes[0]

                    resolve({
                        mcd_id: details.mcdOfferid,
                        mcd_prop_id: details.mcdPropid,
                        profile: details.accountByAccountId as Profile,
                        id: details.id
                    })
                }
            }).catch((error) => reject(error))
        })
    }

    update_offer_checked(offerId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.gql_client.request(UPDATE_OFFER_CHECKED, {
                id: offerId,
                lastChecked: new Date()
            })
            .then(() => resolve())
            .catch((error) => reject(error))
        })
    }

    get_offer_more_details(externalId: string): Promise<{
        title: string
        description: string
        externalId: string
        expires: string
        image: string
        lastChecked: string
    }> {
        return new Promise((resolve, reject) => {
            this.gql_client.request(QUERY_BY_EXTERNAL_ID, {
                externalId,
            })
            .then((data) => {
                const offer = data.allOffers.nodes[0]
                if(offer){
                    resolve({
                        title: offer.title,
                        description: offer.description,
                        externalId: offer.externalId,
                        expires: offer.expires,
                        image: offer.image,
                        lastChecked: offer.lastChecked
                    })
                } else {
                    reject("No offer found")
                }
            })
        })
    }
}