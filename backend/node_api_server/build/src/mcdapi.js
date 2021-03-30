"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var uuid_1 = require("uuid");
var crypto_1 = __importDefault(require("crypto"));
var McdApi = /** @class */ (function () {
    function McdApi() {
        // These seem to be fixed, for some reason...
        this.clientId = "724uBz3ENHxUMrWH73pekFvUKvj8fD7X"; // crypto.randomBytes(16).toString('hex');
        this.clientSecret = "anr4rTy2VRaCfcr9wZE6kVKjSswTv2Rc"; //crypto.randomBytes(16).toString('hex');
    }
    McdApi.prototype.getRandomMcdUUID = function () {
        return crypto_1.default.randomBytes(8 / 2).toString('hex')
            + "-"
            + crypto_1.default.randomBytes(4 / 2).toString('hex')
            + "-"
            + crypto_1.default.randomBytes(4 / 2).toString('hex')
            + "-"
            + crypto_1.default.randomBytes(4 / 2).toString('hex')
            + "-"
            + crypto_1.default.randomBytes(12 / 2).toString('hex');
    };
    // gets an un authenticated bearer token to access any part of the api, returns string bearer token
    McdApi.prototype.get_bearer_unauth = function () {
        // Encode the clientID and client secret in base64
        var buff = Buffer.from(this.clientId + ":" + this.clientSecret, "utf-8");
        var base64encoded = buff.toString('base64');
        var basicAuthToken = "Basic " + base64encoded;
        // Get a bearer token (not authenticated, but just to identify requests)
        return new Promise(function (resolve, reject) {
            axios_1.default({
                method: 'post',
                url: 'https://ap-prod.api.mcd.com/v1/security/auth/token',
                headers: {
                    'authorization': basicAuthToken,
                    'content-type': 'application/x-www-form-urlencoded',
                    'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
                    'accept': '*/*',
                    'connection': 'keep-alive',
                },
                data: "grantType=client_credentials"
            }).then(function (res) {
                resolve(res.data.response.token);
            }).catch(function (error) { return reject(error); });
        });
    };
    // Registers account, returns the access token (bearer)
    McdApi.prototype.register_account = function (username, password, firstname, lastname, postcode) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get_bearer_unauth().then(function (unauth_token) {
                var data = JSON.stringify({ "policies": { "acceptancePolicies": { "1": true, "4": true } }, "credentials": { "type": "email", "loginUsername": username, "password": password }, "preferences": [{ "details": { "email": "en-AU", "MobileApp": "en-AU", "legacyId": "1", "Email": "en-AU", "mobileApp": "en-AU" }, "preferenceId": 1 }, { "details": { "email": 1, "MobileApp": "True", "legacyId": "2", "Email": "True" }, "preferenceId": 2 }, { "details": { "Email": "False", "legacyId": "3", "MobileApp": "True" }, "preferenceId": 3 }, { "details": { "Email": "123456", "legacyId": "4", "MobileApp": "123456" }, "preferenceId": 4 }, { "details": { "Email": "False", "legacyId": "6", "MobileApp": "True" }, "preferenceId": 6 }, { "details": { "Email": "False", "legacyId": "7", "MobileApp": "True" }, "preferenceId": 7 }, { "details": { "Email": "False", "legacyId": "8", "MobileApp": "True" }, "preferenceId": 8 }, { "details": { "Email": "False", "legacyId": "9", "MobileApp": "True" }, "preferenceId": 9 }, { "details": { "Email": "False", "legacyId": "10", "MobileApp": "True" }, "preferenceId": 10 }, { "details": { "Email": "[1,2,3]", "legacyId": "18", "MobileApp": "[4,5]" }, "preferenceId": 11 }, { "details": { "enabled": "Y" }, "preferenceId": 12 }, { "details": { "enabled": "Y" }, "preferenceId": 13 }, { "details": { "enabled": "Y" }, "preferenceId": 14 }, { "details": { "enabled": "Y" }, "preferenceId": 15 }, { "details": { "enabled": "Y" }, "preferenceId": 16 }, { "details": { "enabled": "Y" }, "preferenceId": 17 }, { "details": { "enabled": "Y" }, "preferenceId": 18 }, { "details": { "enabled": "N" }, "preferenceId": 19 }, { "details": { "enabled": "N" }, "preferenceId": 20 }, { "details": { "enabled": "N" }, "preferenceId": 21 }, { "details": { "enabled": "N" }, "preferenceId": 22 }], "audit": { "registrationChannel": "M" }, "device": { "deviceId": "FAD9374E-B414-4D2C-B054-B55889F66868", "os": "ios", "osVersion": "14.3", "deviceIdType": "IDFV", "isActive": "Y", "timezone": "Australia/Brisbane" }, "firstName": firstname, "application": "gma", "optInForMarketing": true, "lastName": lastname, "subscriptions": [{ "subscriptionId": "1", "optInStatus": "Y" }, { "subscriptionId": "2", "optInStatus": "Y" }, { "subscriptionId": "3", "optInStatus": "Y" }, { "subscriptionId": "4", "optInStatus": "Y" }, { "subscriptionId": "5", "optInStatus": "Y" }, { "subscriptionId": "7", "optInStatus": "Y" }, { "subscriptionId": "10", "optInStatus": "Y" }, { "subscriptionId": "11", "optInStatus": "Y" }, { "subscriptionId": "21", "optInStatus": "Y" }, { "subscriptionId": "23", "optInStatus": "N" }], "emailAddress": username, "address": { "zipCode": postcode, "country": "AU" } });
                var config = {
                    method: 'post',
                    url: 'https://ap-prod.api.mcd.com/exp/v1/customer/registration',
                    headers: {
                        'Authorization': 'Bearer ' + unauth_token,
                        'mcd-clientid': _this.clientId,
                        'mcd-uuid': '82B60D00-BF39-4CD8-BB4F-FDC34B884321',
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
                        'mcd-sourceapp': 'GMA',
                        'accept-language': 'en-AU',
                        'mcd-marketid': 'AU',
                        'cache-control': 'true',
                        'accept-encoding': 'gzip;q=1.0, *;q=0.5',
                        'mcd-clientsecret': _this.clientSecret,
                        'accept': 'application/json',
                        'accept-charset': 'utf-8',
                        'Content-Type': 'application/json',
                        'Cookie': '_abck=7FC15CFBC4BA6A81598FDD5D7E1D548B~-1~YAAQdAUgF5ck+KF2AQAA2CQuowVC3na9joY7Lf9/zkGtX3sPOKlJHuO1thIeA+wjAc1RRpr5qME5zaMBCqFY9+njZjEX8v3OyO/pU/OXbH6Pe5sM0v44bU15y8nmCxCH4KaTPSGE95kPIv85zgTubqjKIuZLOMF9y0NEd1V3AEXvQyTBOAe52HdCp7VrCRAgxSoJp2k6r2EG691OhVp6kj5WdjeFFlm7sRnwxUCzbns9D9Mg5LeewPXscwbRm+VB4jNnTECmwImnf4ATdO74ANsVkSe8ONdWUcV+RKXz6sPKO4c7ONaf~-1~-1~-1; bm_sz=1C7C083E2EC2D3F1E2440F8C137C74B5~YAAQ718wF/lpXIh1AQAAeLf4rgq3UW9fqa4AFBvKEqrzeMhqVB4p4b3zJbTcQ86vBHF9wLeiBvzINml/kpqQuTghA99T3+j9lMjLZGRmq0UGx75/prPkDhttXLEsSNssmWGTYSShm+h4hXE1ncRq1ymgmzHUyyQfZb/pGYVFef0udvpgVALQtVB6M49i'
                    },
                    data: data
                };
                axios_1.default(config).then(function (res) {
                    // Mcd Api returns HTTP 200 even if registration fails due to same email address, need to ensure the 'error code' is 20000 not 400000
                    if (res.data.status.code != 20000) {
                        reject(res);
                    }
                    else {
                        var auth_token = res.data.response.accessToken;
                        resolve(auth_token);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        });
    };
    // Log's in profile and gets access bearer token
    McdApi.prototype.login = function (profile, deviceId, type) {
        var _this = this;
        if (deviceId === void 0) { deviceId = uuid_1.v4(); }
        if (type === void 0) { type = "email"; }
        return new Promise(function (resolve, reject) {
            _this.get_bearer_unauth().then(function (unauth_token) {
                axios_1.default({
                    method: 'POST',
                    url: 'https://ap-prod.api.mcd.com/exp/v1/customer/login',
                    headers: {
                        'authorization': 'Bearer ' + unauth_token,
                        'content-type': 'application/json',
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
                        'accept': '*/*',
                        'connection': 'keep-alive',
                        'mcd-clientid': _this.clientId,
                        'mcd-clientsecret': _this.clientSecret,
                        'mcd-sourceapp': 'GMA',
                        'mcd-marketid': 'AU',
                        'accept-encoding': 'gzip;q=1.0, *;q=0.5',
                        'mcd-uuid': _this.getRandomMcdUUID(),
                        'cache-control': true,
                        'accept-language': 'en-AU'
                    },
                    data: {
                        "credentials": {
                            "loginUsername": profile.username,
                            "password": profile.password,
                            "type": type
                        },
                        "deviceId": deviceId
                    }
                }).then(function (res) {
                    var accessToken = res.data.response.accessToken;
                    resolve(accessToken);
                }).catch(function (error) { return reject(error); });
            }).catch(function (error) { return reject(error); });
        });
    };
    McdApi.prototype.get_offers = function (profile) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var offers = [];
            _this.login(profile).then(function (token) {
                axios_1.default({
                    method: 'GET',
                    url: 'https://ap-prod.api.mcd.com/exp/v1/offers',
                    headers: {
                        'authorization': 'Bearer ' + token,
                        'mcd-clientid': _this.clientId,
                        'accept-language': "en-AU",
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
                    }
                })
                    .then(function (res) {
                    for (var _i = 0, _a = res.data.response.offers; _i < _a.length; _i++) {
                        var offer = _a[_i];
                        // Cast the received data into an object of type Offer
                        var recievedOffer = {
                            id: null,
                            mcd_offerId: offer.offerId,
                            mcd_propositionId: offer.offerPropositionId,
                            title: offer.name,
                            longDescription: offer.longDescription,
                            offerBucket: offer.offerBucket,
                            validToUTC: offer.validToUTC,
                            profile: profile,
                            externalId: null,
                            image: offer.imageBaseName
                        };
                        offers.push(recievedOffer);
                    }
                    resolve(offers);
                })
                    .catch(function (e) { return reject(e); });
            });
        });
    };
    McdApi.prototype.get_offer_redemption_code = function (mcd_offerId, mcd_propId, account) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.login(account).then(function (token) {
                var config = {
                    method: 'get',
                    url: 'https://ap-prod.api.mcd.com/exp/v1/offers/redemption/' + String(mcd_propId) + "?offerId=" + String(mcd_offerId),
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'mcd-clientid': _this.clientId,
                        'Accept-Language': 'en-AU',
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
                    }
                };
                axios_1.default(config).then(function (res) {
                    var offerCodeData = {
                        code: res.data.response.randomCode,
                        barcodeData: res.data.response.barCodeContent,
                        expirationTime: res.data.response.expirationTime
                    };
                    resolve(offerCodeData);
                }).catch(function (e) { return reject(e); });
            }).catch(function (error) { return reject(error); });
        });
    };
    return McdApi;
}());
exports.default = McdApi;
