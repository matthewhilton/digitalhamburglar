import crypto from "crypto";
import { Offer, Profile, Token } from "./interfaces";
import McdApi from "./mcdapi";

export default class AccountManager {
    db: any;
    api: McdApi;

    constructor(db: any, api: McdApi){
        this.db = db;
        this.api = api;
    }

    randomDisposableEmail(): string {
        return crypto.randomBytes(8).toString('hex') + "@sharklasers.com";
    }

    randomCompliantPassword(): string {
        // Passwords need at least 6 letters, one uppercase and 1 number.
        return "A1"+crypto.randomBytes(3).toString('hex');
    }

    fillToMaxAccounts(maxAccounts: number){
        // First count the number of accounts that are marked as 'active'
        this.db.find({ active: true }, (err: any, docs: any[]) => {
            const difference = maxAccounts - docs.length;

            console.log("Set to " + maxAccounts + " accounts."); 
            console.log("There are currently " + docs.length + " accounts."); 
            console.log("Difference: " + difference); 

            if(difference > 0){
                for(var i = 0; i < difference; i++){
                    // Will try to register using this random email address
                    // there is a small chance the email address has already been registered
                    // in that case, the number of accounts will simply be not completely accurate
                    // this doesn't really matter, however, as accounts are not created that often
                    const username = this.randomDisposableEmail();
                    const password = this.randomCompliantPassword();

                    // Delay each registration by a bit of time to avoid rate limiting
                    setTimeout(() => {
                        this.api.register(username, password).then((token: Token) => {
                            console.log("Account registered successfully!\n Username: ", username, " Password: ", password);
                            console.log(token)
    
                            // Save this account to the database
                            this.db.insert({ username: username, password: password, active: true });
                        }).catch((e: any) => {
                            console.log("Error when registering account: ", e)
                        })

                        // Rate limit to 5 second intervals
                    }, 5000*i)
                }
            }
            return;
        })
    }

    getAccounts() : Promise<Profile[]> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: any, docs: Profile[]) => {
                if(err) return reject(err);
                return resolve(docs)
            })
        }) 
    }

    getEveryAccountOffer() : Promise<Offer[]> {
        return new Promise((resolve, reject) => {
            this.getAccounts().then((accounts) => {
                let offers : Offer[] = [];
                // Iterate through each account and get offers
                let promiseArray : Array<Promise<Offer[]>> = [];
                let i = 0;
                const promiseResolveDelayFactor = 3000;
                for(const account of accounts){
                    i += 1;
                    // Create an array of promises that resolve to get offers from each account
                    promiseArray.push(
                        new Promise((res, rej) => {
                            setTimeout(() => {
                                console.log("Getting offers for account " + account.username);
                                this.api.getOffers({username: account.username, password: account.password}).then((offers) => {
                                    console.log("Offer success for " + account.username)
                                    res(offers);
                                }).catch(e => rej(e))
                            }, i*promiseResolveDelayFactor)
                        })
                    )
                }
                Promise.all(promiseArray).then((result) => {
                    // Destruct the outer array
                    for(const resultArray of result){
                        let thisOffer: any = resultArray;

                        //console.log("THis offer", thisOffer)
                        if(thisOffer != null){
                            offers = [...offers, ...thisOffer];
                        }
                    }
                    resolve(offers)
                }).catch(e => reject(e));
            }).catch(e => reject(e));
        })
    }
}