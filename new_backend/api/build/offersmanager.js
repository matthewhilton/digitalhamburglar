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
exports.verify_redemption_key = exports.get_offer_redemption_key = exports.offer_available = exports.get_offer_code = exports.convert_offer_for_api = exports.decryptToken = exports.encryptToken = exports.temp_redeem_offer = exports.cancel_temp_redemption = exports.translate_to_offer = exports.get_all_offers = exports.bad_offers_filter = exports.save_entire_offers = exports.obtain_every_account_offers = exports.get_offer_by_id = exports.get_account_offers = exports.OfferState = void 0;
var loginmanager_1 = require("./loginmanager");
var mcdapi_1 = require("./mcdapi");
var client_1 = require("@prisma/client");
var lodash_1 = require("lodash");
var crypto_1 = __importDefault(require("crypto"));
var dotenv_1 = __importDefault(require("dotenv"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var prisma = new client_1.PrismaClient();
dotenv_1.default.config();
var OfferState;
(function (OfferState) {
    OfferState[OfferState["available"] = 1] = "available";
    OfferState[OfferState["temporarily_redeemed"] = 2] = "temporarily_redeemed";
})(OfferState = exports.OfferState || (exports.OfferState = {}));
var get_account_offers = function (profile, token) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Check parameters
                if (profile === undefined && token === undefined) {
                    throw new Error("Neither profile nor token was given, one is required");
                }
                if (!(profile !== undefined && token === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, loginmanager_1.get_token_for_account(profile)];
            case 1:
                token = _a.sent();
                _a.label = 2;
            case 2:
                if (token === undefined) {
                    throw new Error("Could't get token to get account offers");
                }
                return [2 /*return*/, mcdapi_1.getAccountOffers(token)];
        }
    });
}); };
exports.get_account_offers = get_account_offers;
var get_offer_by_id = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var dboffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.offers.findFirst({
                    where: {
                        id: id,
                    }
                })];
            case 1:
                dboffer = _a.sent();
                if (dboffer === null)
                    throw new Error("Could not find offer");
                return [2 /*return*/, exports.translate_to_offer(dboffer)];
        }
    });
}); };
exports.get_offer_by_id = get_offer_by_id;
var obtain_every_account_offers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var allAccounts, accountOfferPromises, allOffersResponses, allOffers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.accounts.findMany({
                    where: {
                        state: loginmanager_1.AccountState.Active
                    }
                })];
            case 1:
                allAccounts = _a.sent();
                accountOfferPromises = allAccounts.map(function (account) { return exports.get_account_offers(account); });
                return [4 /*yield*/, Promise.all(accountOfferPromises)];
            case 2:
                allOffersResponses = _a.sent();
                allOffers = lodash_1.flatten(allOffersResponses);
                // Save all the offers to the DB
                return [4 /*yield*/, exports.save_entire_offers(allOffers)];
            case 3:
                // Save all the offers to the DB
                _a.sent();
                console.log("Successfully obtained and aligned all offers with the DB.");
                return [2 /*return*/];
        }
    });
}); };
exports.obtain_every_account_offers = obtain_every_account_offers;
// Compare offers by the combination of their accountid, propositionid and offerid 
// As offers from the McdAPI don't have IDs (although, offerID is likely an id but not always*), this ensures they are all uniquely identified
var offerCompare = function (a, b) {
    if (a.profile === null || b.profile === null)
        return false;
    return (a.profile.id === b.profile.id && a.offerid === b.offerid && a.propositionid === b.propositionid);
};
var save_entire_offers = function (offers) { return __awaiter(void 0, void 0, void 0, function () {
    var currentDBOffers, currentOffers, newOffers, removedOffers, offerCreationQueries, offerDeletionQueries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.offers.findMany()];
            case 1:
                currentDBOffers = _a.sent();
                return [4 /*yield*/, Promise.all(currentDBOffers.map(exports.translate_to_offer))
                    // Filter out the bad offers that can't be used
                ];
            case 2:
                currentOffers = _a.sent();
                // Filter out the bad offers that can't be used
                offers = offers.filter(exports.bad_offers_filter);
                newOffers = lodash_1.differenceWith(offers, currentOffers, offerCompare);
                console.log("New Offers:");
                console.log(lodash_1.map(newOffers, 'title'));
                removedOffers = lodash_1.differenceWith(currentOffers, offers, offerCompare);
                console.log("Removed Offers:");
                console.log(lodash_1.map(removedOffers, 'title'));
                offerCreationQueries = newOffers.map(function (offer) { return prisma.offers.create({
                    data: {
                        offerid: offer.offerid,
                        propositionid: offer.propositionid,
                        title: offer.title,
                        description: offer.longDescription,
                        image: offer.image,
                        offerbucket: offer.offerBucket,
                        accountid: offer.profile.id || -1,
                        validto: offer.validto,
                        state: offer.state
                    }
                }); });
                offerDeletionQueries = removedOffers.map(function (offer) { return prisma.offers.delete({
                    where: {
                        id: offer.id
                    }
                }); });
                // Run a transaction, deleting all offers and adding the new ones
                return [4 /*yield*/, prisma.$transaction(__spreadArrays(offerDeletionQueries, offerCreationQueries))];
            case 3:
                // Run a transaction, deleting all offers and adding the new ones
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.save_entire_offers = save_entire_offers;
// Filters offers that cant be used (such as punchcard rewards)
var bad_offers_filter = function (offer) {
    if (offer.offerBucket === 'PunchcardReward') {
        return false;
    }
    return true;
};
exports.bad_offers_filter = bad_offers_filter;
var get_all_offers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var offers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.offers.findMany()];
            case 1:
                offers = _a.sent();
                return [2 /*return*/, Promise.all(offers.map(exports.translate_to_offer))];
        }
    });
}); };
exports.get_all_offers = get_all_offers;
// Converts DB offer to Offer interface
var translate_to_offer = function (offer) { return __awaiter(void 0, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.accounts.findFirst({
                    where: {
                        id: offer.accountid
                    }
                })];
            case 1:
                profile = _a.sent();
                return [2 /*return*/, {
                        id: offer.id || null,
                        offerid: offer.offerid,
                        propositionid: offer.propositionid,
                        title: offer.title,
                        longDescription: offer.description,
                        image: offer.image,
                        offerBucket: offer.offerbucket,
                        validto: offer.validto,
                        state: offer.state,
                        profile: profile ? {
                            username: profile.username,
                            password: profile.password,
                            id: profile.id,
                            state: profile.state,
                        } : null
                    }];
        }
    });
}); };
exports.translate_to_offer = translate_to_offer;
var cancel_temp_redemption = function (offer) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, validate_offer_status(offer)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.cancel_temp_redemption = cancel_temp_redemption;
var validate_offer_status = function (offer) { return __awaiter(void 0, void 0, void 0, function () {
    var accountToken, accountOffers, offerStillValid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Verifying status of offer " + offer.id);
                if (offer.profile === null)
                    throw new Error("No profile associated with offer");
                if (offer.id === null)
                    throw new Error('Offer ID was null');
                return [4 /*yield*/, loginmanager_1.get_token_for_account(offer.profile)];
            case 1:
                accountToken = _a.sent();
                return [4 /*yield*/, mcdapi_1.getAccountOffers(accountToken)];
            case 2:
                accountOffers = _a.sent();
                offerStillValid = lodash_1.filter(accountOffers, function (thisOffer) { return offerCompare(offer, thisOffer); }).length >= 1;
                if (!offerStillValid) return [3 /*break*/, 4];
                console.log("Offer was not redeemed, making available again...");
                return [4 /*yield*/, prisma.offers.update({
                        where: {
                            id: offer.id
                        },
                        data: {
                            state: OfferState.available
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                // Offer was redeemed - delete it
                console.log("Offer was redeemed, deleting...");
                return [4 /*yield*/, prisma.offers.delete({
                        where: {
                            id: offer.id
                        }
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
var temp_redeem_offer = function (offer, timeoutSeconds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (offer.id === null)
                    throw new Error("Offer ID cannot be null.");
                return [4 /*yield*/, prisma.offers.update({
                        where: {
                            id: offer.id
                        },
                        data: {
                            state: OfferState.temporarily_redeemed
                        }
                    })];
            case 1:
                _a.sent();
                console.log("Offer " + offer.id + " temporarily redeemed");
                // Set a timeout to change it back to available.
                setTimeout(function (offer) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, validate_offer_status(offer)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, timeoutSeconds * 1000, offer);
                return [2 /*return*/];
        }
    });
}); };
exports.temp_redeem_offer = temp_redeem_offer;
var algorithm = 'aes-128-ecb';
var key = Buffer.from(process.env.SECRET_KEY || "8CBDEC62EB4DCA778F842B02503011B2", "hex");
var encryptToken = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var cipher, encrypted;
    return __generator(this, function (_a) {
        cipher = crypto_1.default.createCipheriv(algorithm, key, null);
        encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return [2 /*return*/, encrypted];
    });
}); };
exports.encryptToken = encryptToken;
var decryptToken = function (encrypted) { return __awaiter(void 0, void 0, void 0, function () {
    var decipher, decrypted;
    return __generator(this, function (_a) {
        decipher = crypto_1.default.createDecipheriv(algorithm, key, null);
        decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
        return [2 /*return*/, decrypted];
    });
}); };
exports.decryptToken = decryptToken;
var get_offer_token = function (offer) { return __awaiter(void 0, void 0, void 0, function () {
    var offerTokenUnencrypted;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                offerTokenUnencrypted = String(offer.id) + '|' + String(offer.offerid) + '|' + String(offer.propositionid) + '|' + String(offer.profile ? offer.profile.id : 'null');
                return [4 /*yield*/, exports.encryptToken(offerTokenUnencrypted)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// Converts offer into ApiOffer 
var convert_offer_for_api = function (offer) { return __awaiter(void 0, void 0, void 0, function () {
    var offerToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, get_offer_token(offer)];
            case 1:
                offerToken = _a.sent();
                return [2 /*return*/, {
                        title: offer.title,
                        longDescription: offer.longDescription,
                        image: offer.image,
                        validto: offer.validto,
                        offertoken: offerToken
                    }];
        }
    });
}); };
exports.convert_offer_for_api = convert_offer_for_api;
var get_offer_code = function (offer) { return __awaiter(void 0, void 0, void 0, function () {
    var accountToken, offerCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (offer.profile === null)
                    throw new Error("Could not get account for offer");
                return [4 /*yield*/, loginmanager_1.get_token_for_account(offer.profile)
                    // Get offer code
                ];
            case 1:
                accountToken = _a.sent();
                return [4 /*yield*/, mcdapi_1.redeemOffer(offer.offerid, offer.propositionid, accountToken)];
            case 2:
                offerCode = _a.sent();
                return [2 /*return*/, offerCode];
        }
    });
}); };
exports.get_offer_code = get_offer_code;
var offer_available = function (offerToken) { return __awaiter(void 0, void 0, void 0, function () {
    var offerTokenDecrypted, offerId, offer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.decryptToken(offerToken)];
            case 1:
                offerTokenDecrypted = _a.sent();
                offerId = Number(offerTokenDecrypted.split('|')[0]);
                return [4 /*yield*/, exports.get_offer_by_id(offerId)];
            case 2:
                offer = _a.sent();
                if (offer.state === OfferState.available)
                    return [2 /*return*/, true];
                return [2 /*return*/, false];
        }
    });
}); };
exports.offer_available = offer_available;
var get_offer_redemption_key = function (offerToken) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonsecret, offerRedemptionSeconds, token;
    return __generator(this, function (_a) {
        jsonsecret = process.env.SECRET_KEY;
        if (jsonsecret === undefined)
            throw new Error("SECRET_KEY not defined in .env");
        offerRedemptionSeconds = Number(process.env.OFFER_TEMP_REDEMPTION_TIME);
        if (offerRedemptionSeconds === undefined)
            throw new Error("OFFER_TEMP_REDEMPTION_TIME not defined in .env");
        token = jsonwebtoken_1.default.sign({ data: String(offerToken) }, jsonsecret, { expiresIn: offerRedemptionSeconds });
        return [2 /*return*/, token];
    });
}); };
exports.get_offer_redemption_key = get_offer_redemption_key;
var verify_redemption_key = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonsecret, payload;
    return __generator(this, function (_a) {
        jsonsecret = process.env.SECRET_KEY;
        if (jsonsecret === undefined)
            throw new Error("SECRET_KEY not defined in .env");
        try {
            payload = jsonwebtoken_1.default.verify(key, jsonsecret);
            return [2 /*return*/, payload];
        }
        catch (e) {
            return [2 /*return*/, false];
        }
        return [2 /*return*/];
    });
}); };
exports.verify_redemption_key = verify_redemption_key;
