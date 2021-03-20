// lib/app.ts
import express = require('express');
import AccountManager from "./src/accountManager"
import { GraphQLClient } from 'graphql-request'
import McdApi from './src/mcdapi';

// Load environment vairables
require('dotenv').config()

const maxAccountsNumber : number = parseInt(process.env.MAX_ACCOUNTS_NUMBER || "") || 0;


// Create a new express application instance
const app: express.Application = express();
var cors = require('cors')
app.use(cors())

// Create GraphQL connection to DB
const gqlclient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || "", { headers: {} })


app.get('/', function (req, res) {
  const am = new AccountManager(gqlclient)
  am.getAllAccounts().then((data) => {
    const account = data[0]
    new McdApi().get_offers(account).then((offers) => {
      
      // Now save the offers
      const am = new AccountManager(gqlclient)
      am.delete_all_offers().then(() => {
        am.save_offers(offers).then(() => {
          res.json(offers)
        })
      }) 

    }).catch(e => console.error(e))
  }).catch(e => console.error(e))
});

// Return the list of offers from the DB
app.get('/getOffers', (req, res) => {
  
})

/*
app.get('/getOfferCode', (req, res) => {
  
  // Get params
  const offerParam = Number(req.query?.offerId);
  const propositionParam = Number(req.query?.propositionId);

  if(isNaN(offerParam)) return res.status(400).json("offerID not given")
  if(isNaN(propositionParam)) return res.status(400).json("propositionID not given")

  // Use the offer param and proposition param to lookup the login details that have that offer
  let offerDetails : any = currentOffers.find((offer) => {
    if(offer.id == offerParam && offer.propositionId == propositionParam) return offer;
  })

  console.log("Found offer ", offerDetails, " for the given id and propositionId")

  if(offerDetails == undefined) {
    console.error("No offer was found for this ID and propositionID")
    return res.status(500).json("Error")
  } else {
    // Login using the offer login details
    api.login(offerDetails.profile.username, offerDetails.profile.password).then((token) => {
      api.getOfferCode(offerParam, propositionParam, token)
      .then(code => res.json(code))
      .catch(e => {
        res.status(500).json("Error")
        console.error(e)
        console.error(e.response.data.status)
      })
    })
  }

 
})

app.get('/preauth', (req, res) => {
  api.getUnauthenticatedToken().then(token => { res.json(token)})
})

app.get('/testLogin', (req,res) => {
  api.login("c7ce8b93a5318f76@sharklasers.com", "A1c7efd7").then((token) => {
    res.json(token)
  })
})

app.get('/stats', (req, res) => {
  // Get cool stats 
  res.json({
    lastUpdatedOffers: lastUpdatedOffersTime,
    updateStatus: updateStatus,
  })
})

const updateAllOffers = () => {
  updateStatus = "Update in Progress"
  console.log("Updating all offers")
  am.getEveryAccountOffer().then(offers => {
    // Filter out the punchcard rewards as they are not supported.
    currentOffers = offers.filter((offer) => {
      if(offer.offerBucket !== "PunchcardReward") return true;
    })
    console.log("Offers updated")
    updateStatus = "Done Updating"
    lastUpdatedOffersTime = new Date();
  }).catch(err => console.log("Error getting every account offer", err));
}

// Only update the offers at certain intervals
setInterval(() => {
  updateAllOffers();
}, maxAccountsNumber * 20000)

*/

console.log("Updating offers every " + maxAccountsNumber * 20000 + " ms")

app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + process.env.PORT);
  //updateAllOffers();
});

