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
var koa_1 = __importDefault(require("koa"));
var router_1 = __importDefault(require("@koa/router"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("@koa/cors"));
var node_cron_1 = __importDefault(require("node-cron"));
var loginmanager_1 = require("./loginmanager");
var offersmanager_1 = require("./offersmanager");
// Load Server
var app = new koa_1.default();
var router = new router_1.default();
// Load environment variables.
dotenv_1.default.config();
router.get('/offers', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var allOffers, offersAvailable, offersToReturn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, offersmanager_1.get_all_offers()];
            case 1:
                allOffers = _a.sent();
                return [4 /*yield*/, allOffers.filter(function (offer) { return offer.state === offersmanager_1.OfferState.available; })];
            case 2:
                offersAvailable = _a.sent();
                return [4 /*yield*/, Promise.all(offersAvailable.map(offersmanager_1.convert_offer_for_api))];
            case 3:
                offersToReturn = _a.sent();
                ctx.body = offersToReturn;
                return [2 /*return*/];
        }
    });
}); });
router.get('/offers/redeem', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var offerToken, offerAvailable, offerRedemptionKey, tokenDecrypted, offerId, offer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                offerToken = ctx.request.query.offerToken;
                ctx.assert(offerToken !== undefined, 400, 'Required parameter offerToken not given.');
                return [4 /*yield*/, offersmanager_1.offer_available(offerToken)];
            case 1:
                offerAvailable = _a.sent();
                console.log("Offer " + offerToken + " is available: " + offerAvailable);
                ctx.assert(offerAvailable, 400, 'Offer not available to be redeemed. Go back to the home menu and try again.');
                return [4 /*yield*/, offersmanager_1.get_offer_redemption_key(offerToken)];
            case 2:
                offerRedemptionKey = _a.sent();
                return [4 /*yield*/, offersmanager_1.decryptToken(offerToken)];
            case 3:
                tokenDecrypted = _a.sent();
                offerId = Number(tokenDecrypted.split('|')[0]);
                return [4 /*yield*/, offersmanager_1.get_offer_by_id(offerId)
                    // Mark offer temporarily redeemed 
                ];
            case 4:
                offer = _a.sent();
                // Mark offer temporarily redeemed 
                return [4 /*yield*/, offersmanager_1.temp_redeem_offer(offer, Number(process.env.OFFER_TEMP_REDEMPTION_TIME))];
            case 5:
                // Mark offer temporarily redeemed 
                _a.sent();
                ctx.body = { key: offerRedemptionKey };
                return [2 /*return*/];
        }
    });
}); });
router.get('/offers/code', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var redemptionKey, key, keyPayload, tokenDecrypted, offerId, offer, offerCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                redemptionKey = ctx.request.query.redemptionKey;
                ctx.assert(redemptionKey !== undefined, 400, 'Required parameter redemptionKey not given.');
                return [4 /*yield*/, offersmanager_1.verify_redemption_key(redemptionKey)];
            case 1:
                key = _a.sent();
                ctx.assert(key !== false, 403, 'Redemption key could not be validated. Either invalid or expired.');
                keyPayload = key;
                return [4 /*yield*/, offersmanager_1.decryptToken(keyPayload.data)];
            case 2:
                tokenDecrypted = _a.sent();
                offerId = Number(tokenDecrypted.split('|')[0]);
                return [4 /*yield*/, offersmanager_1.get_offer_by_id(offerId)];
            case 3:
                offer = _a.sent();
                return [4 /*yield*/, offersmanager_1.get_offer_code(offer)];
            case 4:
                offerCode = _a.sent();
                ctx.body = offerCode;
                return [2 /*return*/];
        }
    });
}); });
router.get('/key/expire', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var redemptionKey, key, keyPayload, tokenDecrypted, offerId, offer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                redemptionKey = ctx.request.query.redemptionKey;
                ctx.assert(redemptionKey !== undefined, 400, 'Required parameter redemptionKey not given.');
                return [4 /*yield*/, offersmanager_1.verify_redemption_key(redemptionKey)];
            case 1:
                key = _a.sent();
                ctx.assert(key !== false, 403, 'Redemption key could not be validated. Either invalid or expired.');
                keyPayload = key;
                return [4 /*yield*/, offersmanager_1.decryptToken(keyPayload.data)];
            case 2:
                tokenDecrypted = _a.sent();
                offerId = Number(tokenDecrypted.split('|')[0]);
                return [4 /*yield*/, offersmanager_1.get_offer_by_id(offerId)];
            case 3:
                offer = _a.sent();
                return [4 /*yield*/, offersmanager_1.cancel_temp_redemption(offer)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get('/key/validity', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var redemptionKey, key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                redemptionKey = ctx.request.query.redemptionKey;
                ctx.assert(redemptionKey !== undefined, 400, 'Required parameter redemptionKey not given.');
                return [4 /*yield*/, offersmanager_1.verify_redemption_key(redemptionKey)];
            case 1:
                key = _a.sent();
                if (key === false)
                    return [2 /*return*/, ctx.body = false];
                ctx.body = true;
                return [2 /*return*/];
        }
    });
}); });
router.get('/details', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var offerToken, tokenDecrypted, offerId, offer, _a, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                offerToken = ctx.request.query.offerToken;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, offersmanager_1.decryptToken(offerToken)];
            case 2:
                tokenDecrypted = _b.sent();
                offerId = Number(tokenDecrypted.split('|')[0]);
                return [4 /*yield*/, offersmanager_1.get_offer_by_id(offerId)];
            case 3:
                offer = _b.sent();
                _a = ctx;
                return [4 /*yield*/, offersmanager_1.convert_offer_for_api(offer)];
            case 4:
                _a.body = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                e_1 = _b.sent();
                console.log("Error getting offer with token " + offerToken);
                console.error(e_1);
                ctx.body = "Error getting offer details";
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Account re-allocation happens at 2am every day, or whenever the server is reset
loginmanager_1.reallocate_active_accounts(0.75); // <-- this will automatically check every offer when accounts are reallocated
node_cron_1.default.schedule('0 2 * * *', function () {
    try {
        loginmanager_1.reallocate_active_accounts(0.75);
    }
    catch (e) {
        console.error("Error reallocating accounts");
        console.error(e);
    }
});
// Offer checking interval - every hour or whenver the server is reset
offersmanager_1.obtain_every_account_offers();
node_cron_1.default.schedule('2 * * * *', function () {
    try {
        offersmanager_1.obtain_every_account_offers();
    }
    catch (e) {
        console.error("Error getting account offers");
        console.error(e);
    }
});
app.use(cors_1.default());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(process.env.PORT || 3000);
