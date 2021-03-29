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
router.get('/list', async (req, res, next) => {
    const offers = await api.get_offers_simple_list()

    const groupByTitle = groupBy('title')
    const offersGroupedByTitle = groupByTitle(offers)

    res.json(offersGroupedByTitle)
})

router.get('/details', async (req, res, next) => {
    const externalId = req.query.externalId
    if(!externalId || externalId == 'undefined') return res.sendStatus(500)

    const offersDetails = await api.get_offer_more_details(externalId)
    return res.json(offersDetails)
})

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

// TODO DEBUG get rid of in production, put on a timer and move out of router
router.get('/update', async (req, res) => {
    const accounts = await api.getAllAccounts()
    const offerChecks: Promise<Offer[]>[] = accounts.map(account => mcd_api.get_offers(account))
    const offerCheckResponses = await Promise.all(offerChecks)

    // Destruct the outer array
    const reducer = (accumulator, currentValue) => [...currentValue, ...accumulator];
    const offers = offerCheckResponses.reduce(reducer)

    res.json(offers)
})

router.get('/redeem', async (req, res) => {
    const externalId: string = req.query.externalId;

    const mcdDetails = await api.get_mcd_offer_details(externalId)
    const redemptionCode = await mcd_api.get_offer_redemption_code(mcdDetails.mcd_id, mcdDetails.mcd_prop_id, mcdDetails.profile)
    res.json(redemptionCode)
})

module.exports = router;