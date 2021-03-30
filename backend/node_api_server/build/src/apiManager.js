"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var queries_1 = require("./queries");
var mcdapi_1 = __importDefault(require("./mcdapi"));
var crypto_1 = __importDefault(require("crypto"));
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var ApiManager = /** @class */ (function () {
    function ApiManager(gql_client) {
        this.gql_client = gql_client;
    }
    ApiManager.prototype.randomDisposableEmail = function () {
        return crypto_1.default.randomBytes(10).toString('hex') + "@sharklasers.com";
    };
    ApiManager.prototype.randomCompliantPassword = function () {
        // Passwords need at least 6 letters, one uppercase and 1 number.
        return "A1" + crypto_1.default.randomBytes(3).toString('hex');
    };
    ApiManager.prototype.randomNameGenerator = function () {
        var firstname = crypto_1.default.randomBytes(10).toString('hex');
        var lastname = crypto_1.default.randomBytes(10).toString('hex');
        return [firstname, lastname];
    };
    ApiManager.prototype.getRandomPostcode = function () {
        var postcodeSelection = [
            6901, 6843, 6762, 3557, 3558, 3515, 4341, 4341, 4312, 810, 801, 2876, 2867, 2839, 2540, 2601, 5330, 5321
        ];
        var randomPostcodeIndex = Math.floor(Math.random() * postcodeSelection.length);
        return (postcodeSelection[randomPostcodeIndex].toString());
    };
    ApiManager.prototype.getAllAccounts = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.gql_client.request(queries_1.GET_ALL_ACCOUNTS).then(function (response) {
                resolve(response.allAccounts.nodes);
            }).catch(function (error) { return reject(error); });
        });
    };
    ApiManager.prototype.createAccount = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var username = _this.randomDisposableEmail();
            var password = _this.randomCompliantPassword();
            var name = _this.randomNameGenerator();
            var postcode = _this.getRandomPostcode();
            // TODO ensure email not in use 
            new mcdapi_1.default().register_account(username, password, name[0], name[1], postcode).then(function (response) {
                // Success registering with remote Api
                // Save the data to our DB
                _this.gql_client.request(queries_1.CREATE_ACCOUNT, {
                    username: username,
                    password: password,
                    created: new Date()
                }).then(function (response) {
                    resolve(response.createAccount.account);
                }).catch(function (error) { return reject(error); });
            }).catch(function (error) { return reject(error); });
        });
    };
    ApiManager.prototype.save_offers = function (offers) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promise_list = [];
            for (var _i = 0, offers_1 = offers; _i < offers_1.length; _i++) {
                var offer = offers_1[_i];
                // TODO work out how to use punchcard offers - right now they give a server error when redeeming
                if (offer.offerBucket === "PunchcardReward") {
                    console.warn("Tried to save punchard reward. Punchcard rewards are not supported. Punchcard rewards will not be saved.");
                }
                else {
                    var offer_to_save = {
                        externalId: sha256_1.default(offer.mcd_offerId + offer.mcd_propositionId + offer.profile.id).toString(),
                        title: offer.title,
                        description: offer.longDescription,
                        mcdOfferid: offer.mcd_offerId,
                        mcdPropid: offer.mcd_propositionId,
                        lastChecked: new Date(),
                        accountId: offer.profile.id,
                        expires: new Date(offer.validToUTC),
                        offerbucket: offer.offerBucket,
                        image: offer.image
                    };
                    promise_list.push(_this.gql_client.request(queries_1.CREATE_OFFER, {
                        input: offer_to_save
                    }));
                }
            }
            Promise.all(promise_list).then(function () {
                console.log("All offers saved");
                resolve();
            }).catch(function (error) { return reject(error); });
        });
    };
    ApiManager.prototype.get_list_offer_id = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.gql_client.request(queries_1.GET_LIST_OFFERS_ID).then(function (data) {
                resolve(data.allOffers.nodes.map(function (data) { return data.id; }));
            }).catch(function (error) { return reject(error); });
        });
    };
    ApiManager.prototype.delete_all_offers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Create list of mutations to run to delete offers
            _this.get_list_offer_id().then(function (offersIdList) {
                var promise_list = [];
                for (var _i = 0, offersIdList_1 = offersIdList; _i < offersIdList_1.length; _i++) {
                    var id = offersIdList_1[_i];
                    var input = {
                        clientMutationId: null,
                        id: id,
                    };
                    promise_list.push(_this.gql_client.request(queries_1.DELETE_OFFER_BY_ID, input));
                }
                // Run the deletions
                Promise.all(promise_list)
                    .then(function () { return resolve(); })
                    .catch(function (error) { return reject(error); });
            });
        });
    };
    ApiManager.prototype.get_offers_simple_list = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.gql_client.request(queries_1.GET_OFFER_SIMPLE_LIST).then(function (data) {
                // Resolve by casting each recived data point into a SimpleOffer 
                resolve(data.allOffers.nodes.map(function (offer) {
                    var recievedOffer = {
                        externalId: offer.externalId,
                        title: offer.title,
                        offerBucket: offer.offerbucket,
                        image: offer.image
                    };
                    return recievedOffer;
                }));
            }).catch(function (error) { return reject(error); });
        });
    };
    ApiManager.prototype.get_mcd_offer_details = function (externalId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log(externalId);
            _this.gql_client.request(queries_1.GET_OFFER_MCD_DETAILS, {
                externalId: externalId
            }).then(function (data) {
                if (data.allOffers.nodes.length == 0) {
                    reject("No offer found for the given external ID");
                }
                else {
                    var details = data.allOffers.nodes[0];
                    resolve({
                        mcd_id: details.mcdOfferid,
                        mcd_prop_id: details.mcdPropid,
                        profile: details.accountByAccountId,
                        id: details.id
                    });
                }
            }).catch(function (error) { return reject(error); });
        });
    };
    ApiManager.prototype.update_offer_checked = function (offerId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.gql_client.request(queries_1.UPDATE_OFFER_CHECKED, {
                id: offerId,
                lastChecked: new Date()
            })
                .then(function () { return resolve(); })
                .catch(function (error) { return reject(error); });
        });
    };
    ApiManager.prototype.get_offer_more_details = function (externalId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.gql_client.request(queries_1.QUERY_BY_EXTERNAL_ID, {
                externalId: externalId,
            })
                .then(function (data) {
                var offer = data.allOffers.nodes[0];
                resolve({
                    title: offer.title,
                    description: offer.description,
                    externalId: offer.externalId,
                    expires: offer.expires,
                    image: offer.image,
                    lastChecked: offer.lastChecked
                });
            });
        });
    };
    return ApiManager;
}());
exports.default = ApiManager;
