"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express = require("express");
var mcdapi_1 = __importDefault(require("./mcdapi"));
var cors = require('cors');
var maxAccountsNumber = 30;
// These seem to be fixed, for some reason...
var clientID = "724uBz3ENHxUMrWH73pekFvUKvj8fD7X"; // crypto.randomBytes(16).toString('hex');
var clientSecret = "anr4rTy2VRaCfcr9wZE6kVKjSswTv2Rc"; //crypto.randomBytes(16).toString('hex');
// Create a new express application instance
var app = express();
app.use(cors());
// Create/Load database
var api = new mcdapi_1.default(clientID, clientSecret);
//const am = new AccountManager(db, api);
var currentOffers = [];
var lastUpdatedOffersTime = null;
var updateStatus = null;
//am.fillToMaxAccounts(maxAccountsNumber);
app.get('/', function (req, res) {
    res.json("Hello!");
});
// Return the list of offers from the DB
app.get('/getOffers', function (req, res) {
    res.json(currentOffers);
});
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

console.log("Updating offers every " + maxAccountsNumber * 20000 + " ms")
const port : Number = 4000;

app.listen(port, function () {
  console.log('Listening on port ' + port);
  updateAllOffers();
});

*/ 
