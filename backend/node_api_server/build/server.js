"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express = require("express");
var accountManager_1 = __importDefault(require("./accountManager"));
var mcdapi_1 = __importDefault(require("./mcdapi"));
var cors = require('cors');
var maxAccountsNumber = 30;
var dbName = "db.json";
// These seem to be fixed, for some reason...
var clientID = "724uBz3ENHxUMrWH73pekFvUKvj8fD7X"; // crypto.randomBytes(16).toString('hex');
var clientSecret = "anr4rTy2VRaCfcr9wZE6kVKjSswTv2Rc"; //crypto.randomBytes(16).toString('hex');
// Create a new express application instance
var app = express();
app.use(cors());
// Create/Load database
var Datastore = require('nedb');
var db = new Datastore({ filename: dbName, autoload: true });
var api = new mcdapi_1.default(clientID, clientSecret);
var am = new accountManager_1.default(db, api);
var currentOffers = [];
var lastUpdatedOffersTime = null;
var updateStatus = null;
am.fillToMaxAccounts(maxAccountsNumber);
app.get('/', function (req, res) {
    res.json("Hello!");
});
// Return the list of offers from the DB
app.get('/getOffers', function (req, res) {
    res.json(currentOffers);
});
app.get('/getOfferCode', function (req, res) {
    var _a, _b;
    // Get params
    var offerParam = Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.offerId);
    var propositionParam = Number((_b = req.query) === null || _b === void 0 ? void 0 : _b.propositionId);
    if (isNaN(offerParam))
        return res.status(400).json("offerID not given");
    if (isNaN(propositionParam))
        return res.status(400).json("propositionID not given");
    // Use the offer param and proposition param to lookup the login details that have that offer
    var offerDetails = currentOffers.find(function (offer) {
        if (offer.id == offerParam && offer.propositionId == propositionParam)
            return offer;
    });
    console.log("Found offer ", offerDetails, " for the given id and propositionId");
    if (offerDetails == undefined) {
        console.error("No offer was found for this ID and propositionID");
        return res.status(500).json("Error");
    }
    else {
        // Login using the offer login details
        api.login(offerDetails.profile.username, offerDetails.profile.password).then(function (token) {
            api.getOfferCode(offerParam, propositionParam, token)
                .then(function (code) { return res.json(code); })
                .catch(function (e) {
                res.status(500).json("Error");
                console.error(e);
                console.error(e.response.data.status);
            });
        });
    }
});
app.get('/preauth', function (req, res) {
    api.getUnauthenticatedToken().then(function (token) { res.json(token); });
});
app.get('/testLogin', function (req, res) {
    api.login("c7ce8b93a5318f76@sharklasers.com", "A1c7efd7").then(function (token) {
        res.json(token);
    });
});
app.get('/stats', function (req, res) {
    // Get cool stats 
    res.json({
        lastUpdatedOffers: lastUpdatedOffersTime,
        updateStatus: updateStatus,
    });
});
var updateAllOffers = function () {
    updateStatus = "Update in Progress";
    console.log("Updating all offers");
    am.getEveryAccountOffer().then(function (offers) {
        // Filter out the punchcard rewards as they are not supported.
        currentOffers = offers.filter(function (offer) {
            if (offer.offerBucket !== "PunchcardReward")
                return true;
        });
        console.log("Offers updated");
        updateStatus = "Done Updating";
        lastUpdatedOffersTime = new Date();
    }).catch(function (err) { return console.log("Error getting every account offer", err); });
};
// Only update the offers at certain intervals
setInterval(function () {
    updateAllOffers();
}, maxAccountsNumber * 20000);
console.log("Updating offers every " + maxAccountsNumber * 20000 + " ms");
var port = 4000;
app.listen(port, function () {
    console.log('Listening on port ' + port);
    updateAllOffers();
});
