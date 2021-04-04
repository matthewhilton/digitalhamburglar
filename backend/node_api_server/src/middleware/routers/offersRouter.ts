import { GraphQLClient } from "graphql-request";
import ApiManager from "../../apiManager";
import McdApi from "../../mcdapi";
import sha256 from 'crypto-js/sha256';
import { Offer } from "src/interfaces";
import { groupBy, sample, compact } from "lodash"

require('dotenv').config()

const express = require('express');
const router = express.Router();

const gqlclient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || "", { headers: {} })
const api = new ApiManager(gqlclient)
const mcd_api = new McdApi()

// Start an interval to update the offers
const updateOffers = async () => {
  console.log("Updating offers...")
  try {
    const accounts = await api.getAllAccounts()

    // Create array of promises that resolve to get the offers, but delay them all to avoid rate limiting
    const offerChecks: Promise<Offer[]>[] = accounts.map((account, i) => mcd_api.get_offers(account, i*Number(process.env.OFFER_CHECK_INTERVAL)))

    // Because Promise.All will reject when ANY one promise fails, catch any errors and just return undefined
    const offerChecksWithPromiseHandlers = offerChecks.map(p => p.catch((e) => {
      console.log(e)
      return undefined
    }))
    const offerCheckResponses = await Promise.all(offerChecksWithPromiseHandlers)

    // Remove any that were undefined (failed promises)
    const offerResponses: Array<Offer[]> = compact(offerCheckResponses)
    console.log(`Getting offers from accounts: ${offerResponses.length} / ${offerCheckResponses.length} accounts' offers were saved`)
   
    // Destruct the outer array
    const reducer = (accumulator, currentValue) => [...currentValue, ...accumulator];
    const offersAcrossAllAccounts = offerResponses.reduce(reducer, [])
  
    // Drop all offers then Save the new offers in DB 
    await api.delete_all_offers()
    await api.save_offers(offersAcrossAllAccounts)
  } catch(err) {
    console.log("An error ocurred while updating offers")
    console.log(err)
  }
}

router.get('/list/groups', async(req, res, next) => {
  try {
    const offers = await api.get_offers_simple_list()
  
    const offersGroupedByTitle = groupBy(offers, offer => offer.title)
  
    const offerHashGroups = Object.keys(offersGroupedByTitle).map(offerTitle => ({
      title: offerTitle,
      image: offersGroupedByTitle[offerTitle][0].image,
      count: offersGroupedByTitle[offerTitle].length,
      hash: sha256(offerTitle).toString()
    }))
  
    res.json(offerHashGroups)
  }catch(err) {
    console.log(err)
    res.status(500).json("Unknown error ocurred")
  }
  
})

// List of offers in simple format
router.get('/list', async (req, res, next) => {
    const offers = await api.get_offers_simple_list()
    const offersGroupedByTitle = groupBy(offers, offer => offer.title)
    res.json(offersGroupedByTitle)
})

router.get('/details', async (req, res, next) => {
    try {
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
    } catch(err) {
      console.log(err)
      res.status(500).json("Unknown error ocurred")
    }
})

router.get('/redeem', async (req, res) => {
  try {
    const externalId = req.query.externalId

    if(!externalId) {
      res.status(400).json("External ID query parameter not given")
      return;
    }

    const mcdDetails = await api.get_mcd_offer_details(externalId)
    const redemptionCode = await mcd_api.get_offer_redemption_code(mcdDetails.mcd_id, mcdDetails.mcd_prop_id, mcdDetails.profile)
    res.json(redemptionCode)
  } catch(err) {
    console.log(err)
    res.status(500).json("Unknown error ocurred")
  }
})

// Start auto offer updating but only if in production
const updateInterval = process.env.OFFER_UPDATE_INTERVAL
if(process.env.NODE_ENV === 'PRODUCTION'){
  setTimeout(() => {
    console.log("Starting offer check interval set for " + updateInterval)
    updateOffers()
    setInterval(updateOffers, Number(updateInterval))
  }, 5000)
} else {
  // Else open up an endpoint to run the offer update check instead
  console.log("Starting offer check router route")
  router.get('/update', (req, res) => {
    updateOffers()
    res.json("Success")
  })
}



module.exports = router;