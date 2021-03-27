"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_request_1 = require("graphql-request");
var apiManager_1 = __importDefault(require("../../apiManager"));
var mcdapi_1 = __importDefault(require("../../mcdapi"));
require('dotenv').config();
var express = require('express');
var router = express.Router();
var gqlclient = new graphql_request_1.GraphQLClient(process.env.GRAPHQL_ENDPOINT || "", { headers: {} });
var api = new apiManager_1.default(gqlclient);
var mcd_api = new mcdapi_1.default();
// List of offers in simple format
router.get('/list', function (req, res, next) {
    api.get_offers_simple_list().then(function (offers) {
        // Don't send actual offer id's, only send a list of available offers and the number of them available 
        var groupByTitle = groupBy('title');
        var grouped_offers = groupByTitle(offers);
        res.json(grouped_offers);
    });
});
router.get('/details', function (req, res, next) {
    api.get_offer_more_details(req.query.externalId).then(function (data) { return res.json(data); }).catch(function (e) { return res.send_status(500); });
});
var groupBy = function (key) { return function (array) {
    return array.reduce(function (objectsByKeyValue, obj) {
        var value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
}; };
// TODO DEBUG get rid of in production, put on a timer and move out of router
router.get('/update', function (req, res) {
    api.getAllAccounts().then(function (accounts) {
        var offer_check_promises = [];
        for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
            var account = accounts_1[_i];
            offer_check_promises.push(mcd_api.get_offers(account));
        }
        api.delete_all_offers().then(function () {
            Promise.all(offer_check_promises).then(function (data) {
                // Desctruct the promise return value
                // Destruct the outer array
                var offers = [];
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var resultArray = data_1[_i];
                    var thisOffer = resultArray;
                    if (thisOffer != null) {
                        offers = __spreadArrays(offers, thisOffer);
                    }
                }
                // Save the offers into the db for easy access later
                api.save_offers(offers).then(function () {
                    res.json(offers);
                });
            });
        });
    });
});
router.get('/redeem', function (req, res) {
    var externalId = req.query.externalId;
    api.get_mcd_offer_details(externalId).then(function (details) {
        mcd_api.get_offer_redemption_code(details.mcd_id, details.mcd_prop_id, details.profile).then(function (code) {
            res.json(code);
        });
    });
});
module.exports = router;
