"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var uuid_1 = require("uuid");
var crypto_1 = __importDefault(require("crypto"));
var McdApi = /** @class */ (function () {
    function McdApi(clientID, clientSecret) {
        this.clientID = clientID;
        this.clientSecret = clientSecret;
    }
    McdApi.prototype.getUnauthenticatedToken = function () {
        var buff = Buffer.from(this.clientID + ":" + this.clientSecret, "utf-8");
        var base64encoded = buff.toString('base64');
        var basicAuthToken = "Basic " + base64encoded;
        // Send the base64 as a basic authentication to get a bearer token (still unauthenticated, however)
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
    McdApi.prototype.login = function (username, password, type, deviceID, cacheToken) {
        var _this = this;
        if (type === void 0) { type = "email"; }
        if (deviceID === void 0) { deviceID = uuid_1.v4(); }
        if (cacheToken === void 0) { cacheToken = true; }
        return new Promise(function (resolve, reject) {
            // First get unauthenticated token to access the login API 
            _this.getUnauthenticatedToken().then(function (unauthenticatedToken) {
                // Now run the credentials through the login endpoint 
                axios_1.default({
                    method: 'POST',
                    url: 'https://ap-prod.api.mcd.com/exp/v1/customer/login',
                    headers: {
                        'authorization': 'Bearer ' + unauthenticatedToken,
                        'content-type': 'application/json',
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
                        'accept': '*/*',
                        'connection': 'keep-alive',
                        'mcd-clientid': _this.clientID,
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
                            "loginUsername": username,
                            "password": password,
                            "type": type
                        },
                        "deviceId": deviceID
                    }
                }).then(function (res) {
                    // Successful login, save access and refresh token and resolve with it
                    var tokenData = {
                        accessToken: res.data.response.accessToken,
                        refreshToken: res.data.response.refreshToken,
                    };
                    if (cacheToken) {
                        _this.authenticatedToken = tokenData;
                    }
                    resolve(tokenData);
                }).catch(function (error) { return reject(error); });
            }).catch(function (e) { return reject(e); });
        });
    };
    McdApi.prototype.register = function (username, password, postcode, cacheToken) {
        var _this = this;
        if (postcode === void 0) { postcode = this.getRandomPostcode(); }
        if (cacheToken === void 0) { cacheToken = true; }
        return new Promise(function (resolve, reject) {
            _this.getUnauthenticatedToken().then(function (unauthenticatedToken) {
                // Auto generated from Postman
                var data = JSON.stringify({ "policies": { "acceptancePolicies": { "1": true, "4": true } }, "credentials": { "type": "email", "loginUsername": username, "password": password }, "preferences": [{ "details": { "email": "en-AU", "MobileApp": "en-AU", "legacyId": "1", "Email": "en-AU", "mobileApp": "en-AU" }, "preferenceId": 1 }, { "details": { "email": 1, "MobileApp": "True", "legacyId": "2", "Email": "True" }, "preferenceId": 2 }, { "details": { "Email": "False", "legacyId": "3", "MobileApp": "True" }, "preferenceId": 3 }, { "details": { "Email": "123456", "legacyId": "4", "MobileApp": "123456" }, "preferenceId": 4 }, { "details": { "Email": "False", "legacyId": "6", "MobileApp": "True" }, "preferenceId": 6 }, { "details": { "Email": "False", "legacyId": "7", "MobileApp": "True" }, "preferenceId": 7 }, { "details": { "Email": "False", "legacyId": "8", "MobileApp": "True" }, "preferenceId": 8 }, { "details": { "Email": "False", "legacyId": "9", "MobileApp": "True" }, "preferenceId": 9 }, { "details": { "Email": "False", "legacyId": "10", "MobileApp": "True" }, "preferenceId": 10 }, { "details": { "Email": "[1,2,3]", "legacyId": "18", "MobileApp": "[4,5]" }, "preferenceId": 11 }, { "details": { "enabled": "Y" }, "preferenceId": 12 }, { "details": { "enabled": "Y" }, "preferenceId": 13 }, { "details": { "enabled": "Y" }, "preferenceId": 14 }, { "details": { "enabled": "Y" }, "preferenceId": 15 }, { "details": { "enabled": "Y" }, "preferenceId": 16 }, { "details": { "enabled": "Y" }, "preferenceId": 17 }, { "details": { "enabled": "Y" }, "preferenceId": 18 }, { "details": { "enabled": "N" }, "preferenceId": 19 }, { "details": { "enabled": "N" }, "preferenceId": 20 }, { "details": { "enabled": "N" }, "preferenceId": 21 }, { "details": { "enabled": "N" }, "preferenceId": 22 }], "audit": { "registrationChannel": "M" }, "device": { "deviceId": "FAD9374E-B414-4D2C-B054-B55889F66868", "os": "ios", "osVersion": "14.3", "deviceIdType": "IDFV", "isActive": "Y", "timezone": "Australia/Brisbane" }, "firstName": "Ronald", "application": "gma", "optInForMarketing": true, "lastName": "Mcdonald", "subscriptions": [{ "subscriptionId": "1", "optInStatus": "Y" }, { "subscriptionId": "2", "optInStatus": "Y" }, { "subscriptionId": "3", "optInStatus": "Y" }, { "subscriptionId": "4", "optInStatus": "Y" }, { "subscriptionId": "5", "optInStatus": "Y" }, { "subscriptionId": "7", "optInStatus": "Y" }, { "subscriptionId": "10", "optInStatus": "Y" }, { "subscriptionId": "11", "optInStatus": "Y" }, { "subscriptionId": "21", "optInStatus": "Y" }, { "subscriptionId": "23", "optInStatus": "N" }], "emailAddress": username, "address": { "zipCode": postcode, "country": "AU" } });
                var config = {
                    method: 'post',
                    url: 'https://ap-prod.api.mcd.com/exp/v1/customer/registration',
                    headers: {
                        'Authorization': 'Bearer ' + unauthenticatedToken,
                        'mcd-clientid': '724uBz3ENHxUMrWH73pekFvUKvj8fD7X',
                        'mcd-uuid': '82B60D00-BF39-4CD8-BB4F-FDC34B884321',
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
                        'mcd-sourceapp': 'GMA',
                        'accept-language': 'en-AU',
                        'mcd-marketid': 'AU',
                        'cache-control': 'true',
                        'accept-encoding': 'gzip;q=1.0, *;q=0.5',
                        'mcd-clientsecret': 'anr4rTy2VRaCfcr9wZE6kVKjSswTv2Rc',
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
                        var tokenData = {
                            accessToken: res.data.response.accessToken,
                            refreshToken: res.data.response.refreshToken,
                        };
                        if (cacheToken) {
                            _this.authenticatedToken = tokenData;
                        }
                        resolve(tokenData);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        });
    };
    McdApi.prototype.getRandomPostcode = function () {
        var postcodeSelection = [
            6901, 6843, 6762, 3557, 3558, 3515, 4341, 4341, 4312, 810, 801, 2876, 2867, 2839, 2540, 2601, 5330, 5321
        ];
        var randomPostcodeIndex = Math.floor(Math.random() * postcodeSelection.length);
        return (postcodeSelection[randomPostcodeIndex].toString());
    };
    McdApi.prototype.getOffers = function (profile) {
        var _this = this;
        var offers = [];
        return new Promise(function (resolve, reject) {
            _this.login(profile.username, profile.password).then(function (token) {
                axios_1.default({
                    method: 'GET',
                    url: 'https://ap-prod.api.mcd.com/exp/v1/offers',
                    headers: {
                        'authorization': 'Bearer ' + (token === null || token === void 0 ? void 0 : token.accessToken),
                        'mcd-clientid': _this.clientID,
                        'accept-language': "en-AU",
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
                    }
                })
                    .then(function (res) {
                    for (var _i = 0, _a = res.data.response.offers; _i < _a.length; _i++) {
                        var offer = _a[_i];
                        offers.push({
                            id: offer.offerId,
                            propositionId: offer.offerPropositionId,
                            name: offer.name,
                            shortDescription: offer.shortDescription,
                            longDescription: offer.longDescription,
                            offerBucket: offer.offerBucket,
                            validToUTC: offer.validToUTC,
                            profile: profile
                        });
                    }
                    resolve(offers);
                })
                    .catch(function (e) { return reject(e); });
            });
        });
    };
    McdApi.prototype.getOfferCode = function (offerId, propositionId, token) {
        var _this = this;
        if (token === void 0) { token = undefined; }
        return new Promise(function (resolve, reject) {
            var _a;
            if (_this.authenticatedToken === undefined && token === undefined)
                reject("API Object not authenticated and no token was given. Run .login() with cacheToken=true or provide a token to this function.");
            if (token === undefined)
                token = _this.authenticatedToken;
            var config = {
                method: 'get',
                url: 'https://ap-prod.api.mcd.com/exp/v1/offers/redemption/' + String(propositionId) + "?offerId=" + String(offerId),
                headers: {
                    'Authorization': 'Bearer ' + ((_a = _this.authenticatedToken) === null || _a === void 0 ? void 0 : _a.accessToken),
                    'mcd-clientid': _this.clientID,
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
        });
    };
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
    return McdApi;
}());
exports.default = McdApi;
