"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemOffer = exports.testToken = exports.getAccountOffers = exports.refreshToken = exports.login = exports.get_bearer_unauth = exports.getRandomMcdUUID = void 0;
var uuid_1 = require("uuid");
var crypto_1 = __importDefault(require("crypto"));
var wretch_1 = __importDefault(require("wretch"));
var wretch_middlewares_1 = require("wretch-middlewares");
var loginmanager_1 = require("./loginmanager");
var offersmanager_1 = require("./offersmanager");
// Fixed credentials...
var clientSecret = "anr4rTy2VRaCfcr9wZE6kVKjSswTv2Rc";
var clientId = "724uBz3ENHxUMrWH73pekFvUKvj8fD7X";
wretch_1.default().polyfills({
    fetch: require("node-fetch"),
    FormData: require("form-data"),
    URLSearchParams: require("url").URLSearchParams
});
var getRandomMcdUUID = function () {
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
exports.getRandomMcdUUID = getRandomMcdUUID;
var get_bearer_unauth = function () {
    // Encode the clientID and client secret in base64
    var buff = Buffer.from(clientId + ":" + clientSecret, "utf-8");
    var base64encoded = buff.toString('base64');
    var basicAuthToken = "Basic " + base64encoded;
    // Get a bearer token (not authenticated, but just to identify requests)
    return new Promise(function (resolve, reject) {
        wretch_1.default()
            .middlewares([
            wretch_middlewares_1.retry({
                maxAttempts: 3,
                delayTimer: 150
            })
        ])
            .url("https://ap-prod.api.mcd.com/v1/security/auth/token")
            .headers({
            'authorization': basicAuthToken,
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
            'accept': '*/*',
            'connection': 'keep-alive',
        })
            .body("grantType=client_credentials")
            .post()
            .json(function (json) {
            resolve(json.response.token);
        })
            .catch(function (err) {
            reject(err);
        });
    });
};
exports.get_bearer_unauth = get_bearer_unauth;
var login = function (profile, deviceId, type, mcdUUID) {
    if (deviceId === void 0) { deviceId = uuid_1.v4(); }
    if (type === void 0) { type = "email"; }
    if (mcdUUID === void 0) { mcdUUID = exports.getRandomMcdUUID(); }
    return new Promise(function (resolve, reject) {
        exports.get_bearer_unauth().then(function (unauth_token) {
            wretch_1.default()
                .url("https://ap-prod.api.mcd.com/exp/v1/customer/login")
                .headers({
                'authorization': 'Bearer ' + unauth_token,
                'content-type': 'application/json',
                'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
                'accept': '*/*',
                'connection': 'keep-alive',
                'mcd-clientid': clientId,
                'mcd-clientsecret': clientSecret,
                'mcd-sourceapp': 'GMA',
                'mcd-marketid': 'AU',
                'accept-encoding': 'gzip;q=1.0, *;q=0.5',
                'mcd-uuid': mcdUUID,
                'cache-control': 'true',
                'accept-language': 'en-AU'
            })
                .body(JSON.stringify({
                "credentials": {
                    "loginUsername": profile.username,
                    "password": profile.password,
                    "type": type
                },
                "deviceId": deviceId
            }))
                .post()
                .json(function (json) {
                console.log(json);
                if (json.status.code == 40000) {
                    reject(json.status);
                }
                resolve(json.response);
            })
                .catch(function (err) { return reject(err); });
        }).catch(function (err) { return reject(err); });
    });
};
exports.login = login;
var refreshToken = function (token, mcdUUID) {
    if (mcdUUID === void 0) { mcdUUID = exports.getRandomMcdUUID(); }
    return new Promise(function (resolve, reject) {
        wretch_1.default()
            .url("https://ap-prod.api.mcd.com/exp/v1/customer/login/refresh")
            .headers({
            'authorization': 'Bearer ' + token.accessToken,
            'mcd-clientid': clientId,
            'mcd-clientsecret': clientSecret,
            'Content-Type': 'application/json',
            'mcd-marketid': 'AU',
            'accept-language': 'en-AU',
            'accept': 'application/json',
            'mcd-sourceapp': 'GMA',
            'mcd-uuid': mcdUUID
        })
            .post({ "refreshToken": token.refreshToken })
            .json(function (json) {
            if (json.status.code === 20000) {
                resolve(json.response);
            }
            // Else reject
            reject(json.status);
        })
            .catch(function (err) { return reject(err); });
    });
};
exports.refreshToken = refreshToken;
var getAccountOffers = function (token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var accountForToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginmanager_1.get_profile_db(token)];
                case 1:
                    accountForToken = _a.sent();
                    wretch_1.default()
                        .url("https://ap-prod.api.mcd.com/exp/v1/offers")
                        .headers({
                        'authorization': 'Bearer ' + token.accessToken,
                        'mcd-clientid': clientId,
                        'accept-language': "en-AU",
                        'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
                    })
                        .get()
                        .json(function (json) {
                        // Restructure them into the Offer interfacejson.response.offers.map(offer => {
                        var offersReceived = json.response.offers.map(function (offer) {
                            var receivedOffer = {
                                id: null,
                                offerid: offer.offerId,
                                propositionid: offer.offerPropositionId,
                                title: offer.name,
                                longDescription: offer.longDescription,
                                offerBucket: offer.offerBucket,
                                validto: new Date(offer.validToUTC),
                                image: offer.imageBaseName,
                                profile: accountForToken,
                                state: offersmanager_1.OfferState.available,
                            };
                            return receivedOffer;
                        });
                        resolve(offersReceived);
                    })
                        .catch(function (err) { return reject(err); });
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.getAccountOffers = getAccountOffers;
var testToken = function (token, mcdUUID) {
    if (mcdUUID === void 0) { mcdUUID = exports.getRandomMcdUUID(); }
    return new Promise(function (resolve, reject) {
        // Tests a given token for expiry by accessing the profile endpoint
        wretch_1.default()
            .url("https://ap-prod.api.mcd.com/exp/v1/customer/profile")
            .headers({
            'authorization': 'Bearer ' + token.accessToken,
            'mcd-clientid': clientId,
            'mcd-clientsecret': clientSecret,
            'accept-language': "en-AU",
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2',
            'mcd-uuid': mcdUUID,
            'mcd-sourceapp': 'GMA',
        })
            .get()
            .json(function (json) {
            if (json.status.code === 20000)
                resolve(true);
            resolve(false);
        })
            .catch(function (err) {
            console.log('Token validation failed');
            console.log(err);
            resolve(false);
        });
    });
};
exports.testToken = testToken;
var redeemOffer = function (mcd_offerId, mcd_propId, accountToken) {
    return new Promise(function (resolve, reject) {
        var url = 'https://ap-prod.api.mcd.com/exp/v1/offers/redemption/' + String(mcd_propId);
        // Sometimes an offerID is zero, if this is the case do not append it to the end or else it causes errors 
        if (mcd_offerId != 0) {
            url = url + "?offerId=" + String(mcd_offerId);
        }
        wretch_1.default(url)
            .headers({
            'Authorization': 'Bearer ' + accountToken.accessToken,
            'mcd-clientid': clientId,
            'Accept-Language': 'en-AU',
            'user-agent': 'MCDSDK/8.0.15 (iPhone; 14.3; en-AU) GMA/6.2'
        })
            .get()
            .json(function (json) {
            var offerCodeData = {
                code: json.response.randomCode,
                barcodeData: json.response.barCodeContent,
                expirationTime: json.response.expirationTime
            };
            resolve(offerCodeData);
        })
            .catch(function (err) { return reject(err); });
    });
};
exports.redeemOffer = redeemOffer;
