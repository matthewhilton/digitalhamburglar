import { GraphQLClient } from "graphql-request";
import ApiManager from "../../apiManager";
import McdApi from "../../mcdapi";
import sha256 from 'crypto-js/sha256';
import { Offer } from "src/interfaces";

require('dotenv').config()

const express = require('express');
const router = express.Router();

const gqlclient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || "", { headers: {} })
const api = new ApiManager(gqlclient)
const mcd_api = new McdApi()

// List of offers in simple format
router.get('/list', (req, res, next) => {
    api.get_offers_simple_list().then((offers) => {
        // Don't send actual offer id's, only send a list of available offers and the number of them available 
        const groupByTitle = groupBy('title')
        const grouped_offers = groupByTitle(offers)

        res.json(grouped_offers)
    })
})

router.get('/details', (req, res, next) => {
    api.get_offer_more_details(req.query.externalId).then((data) => res.json(data)).catch(e => res.send_status(500))
})

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

// TODO DEBUG get rid of in production, put on a timer and move out of router
router.get('/update', (req, res) => {
    api.getAllAccounts().then((accounts) => {
        let offer_check_promises: Array<Promise<Offer[]>> = []
        for(const account of accounts) {
            offer_check_promises.push(
                mcd_api.get_offers(account)
            )
        }

        api.delete_all_offers().then(() => {
            Promise.all(offer_check_promises).then((data) => {
                // Desctruct the promise return value
                // Destruct the outer array
                let offers : Offer[] = [];
                for(const resultArray of data){
                    let thisOffer: any = resultArray;
    
                    if(thisOffer != null){
                        offers = [...offers, ...thisOffer];
                    }
                }
    
                // Save the offers into the db for easy access later
                api.save_offers(offers).then(() => {
                    res.json(offers)
                })
            })
        }) 
    })
})

router.get('/redeem', (req, res) => {
    const externalId: string = req.query.externalId;

    api.get_mcd_offer_details(externalId).then((details) => {
        mcd_api.get_offer_redemption_code(details.mcd_id, details.mcd_prop_id, details.profile).then((code) => {
            res.json(code)
        })
    })
})

module.exports = router;