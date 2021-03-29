import { GraphQLClient } from "graphql-request";
import ApiManager from "../../apiManager";
import McdApi from "../../mcdapi";
import sha256 from 'crypto-js/sha256';
import { Offer } from "src/interfaces";
import { groupBy, sample } from "lodash"

require('dotenv').config()

const express = require('express');
const router = express.Router();

const gqlclient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || "", { headers: {} })
const api = new ApiManager(gqlclient)
const mcd_api = new McdApi()

  
router.get('/list/groups', async(req, res, next) => {
  const offers = await api.get_offers_simple_list()
  
  const offersGroupedByTitle = groupBy(offers, offer => offer.title)

  const offerHashGroups = Object.keys(offersGroupedByTitle).map(offerTitle => ({
    title: offerTitle,
    image: offersGroupedByTitle[offerTitle][0].image,
    hash: sha256(offerTitle).toString()
  }))

  res.json(offerHashGroups)
})

// List of offers in simple format
router.get('/list', async (req, res, next) => {
    const offers = await api.get_offers_simple_list()
    const offersGroupedByTitle = groupBy(offers, offer => offer.title)
    res.json(offersGroupedByTitle)
})

router.get('/details', async (req, res, next) => {
    // Takes in offer hash, determines an offer to redeem from that group and redeems it 
    const offerHash: string = req.query.offerHash

    if(!offerHash) {
      res.status(400).json("Offer hash query parameter not given")
    }

    const allOffers = await api.get_offers_simple_list()
    const offersFromThisGroup = allOffers.filter(offer => sha256(offer.title).toString() === offerHash)

    // Sample one randomly to help prevent two people getting the same offer
    const selectedOffer = sample(offersFromThisGroup)

    if(!selectedOffer) {
      res.status(500).json("Could not find offer")
      return
    }

    if(!selectedOffer.externalId) {
      res.status(500)
      return
    }

    const offersDetails = await api.get_offer_more_details(selectedOffer.externalId)
    res.json(offersDetails)
})

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
    const externalId = req.query.externalId

    if(!externalId) {
      res.status(400).json("External ID query parameter not given")
      return;
    }

    const mcdDetails = await api.get_mcd_offer_details(externalId)
    const redemptionCode = await mcd_api.get_offer_redemption_code(mcdDetails.mcd_id, mcdDetails.mcd_prop_id, mcdDetails.profile)
    res.json(redemptionCode)
})

module.exports = router;