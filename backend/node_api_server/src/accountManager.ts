import { GraphQLClient } from "graphql-request";
import { Offer, Profile } from "./interfaces";
import { GET_ALL_ACCOUNTS, CREATE_ACCOUNT, CREATE_OFFER, GET_LIST_OFFERS_ID, DELETE_OFFER_BY_ID } from "./queries";
import { DeleteOfferByIdInput, DeleteOfferInput, OfferInput } from "./generated/graphql"
import McdApi from "./mcdapi"
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import sha256 from 'crypto-js/sha256';

export default class AccountManager {
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
                const offer_to_save: OfferInput = {
                    externalId: sha256(offer.mcd_offerId + offer.mcd_propositionId + new Date().toString()).toString(),
                    title: offer.shortDescription,
                    description: offer.longDescription,
                    mcdOfferid: offer.mcd_offerId,
                    mcdPropid: offer.mcd_propositionId,
                    lastChecked: new Date(),
                    accountId: offer.profile.id,
                    expires: new Date(offer.validToUTC),
                    offerbucket: offer.offerBucket
                }

                promise_list.push(this.gql_client.request(CREATE_OFFER, {
                    input: offer_to_save
                }))
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
            
            // Create list of mutations to run to delete offers given
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
}