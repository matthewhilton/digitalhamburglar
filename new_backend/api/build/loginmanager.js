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
Object.defineProperty(exports, "__esModule", { value: true });
exports.move_out_of_rotation = exports.reallocate_active_accounts = exports.get_profile_db = exports.reset_account_token = exports.get_token_for_account = exports.AccountState = void 0;
var client_1 = require("@prisma/client");
var mcdapi_1 = require("./mcdapi");
var lodash_1 = require("lodash");
var offersmanager_1 = require("./offersmanager");
var prisma = new client_1.PrismaClient();
var AccountState;
(function (AccountState) {
    AccountState[AccountState["ManualInactive"] = 0] = "ManualInactive";
    AccountState[AccountState["Active"] = 1] = "Active";
    AccountState[AccountState["OutOfRotation"] = 2] = "OutOfRotation";
})(AccountState = exports.AccountState || (exports.AccountState = {}));
var get_token_for_account = function (profile) { return __awaiter(void 0, void 0, void 0, function () {
    var user, usersToken, hoursBetweenDates, tokenValid, refreshedToken, data, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Getting token for account " + (profile.username || profile.id));
                return [4 /*yield*/, prisma.accounts.findFirst({
                        where: {
                            username: profile.username,
                        }
                    })];
            case 1:
                user = _b.sent();
                if (user === null) {
                    // User hasn't been logged in according to DB, so login and save token to DB
                    console.log("user does not exist, getting new token and saving");
                    return [2 /*return*/, exports.reset_account_token(profile)];
                }
                usersToken = {
                    accessToken: user.accesstoken,
                    refreshToken: user.refreshtoken
                };
                hoursBetweenDates = Math.abs(new Date().valueOf() - user.tokenlastrefreshed.valueOf()) / 1000 / 60 / 60;
                console.log("Token is " + hoursBetweenDates + " hours old.");
                if (!(hoursBetweenDates < 0.9)) return [3 /*break*/, 5];
                console.log("Token is not old enough to renew, testing token");
                return [4 /*yield*/, mcdapi_1.testToken(usersToken)];
            case 2:
                tokenValid = _b.sent();
                if (!!tokenValid) return [3 /*break*/, 4];
                console.log("Token was not valid, resetting token...");
                return [4 /*yield*/, exports.reset_account_token(profile)];
            case 3: return [2 /*return*/, _b.sent()];
            case 4:
                console.log("Token is valid.");
                return [2 /*return*/, usersToken];
            case 5:
                _b.trys.push([5, 8, , 10]);
                console.log("Refreshing Token...");
                return [4 /*yield*/, mcdapi_1.refreshToken(usersToken)];
            case 6:
                refreshedToken = _b.sent();
                data = {
                    accesstoken: refreshedToken.accessToken,
                    refreshtoken: refreshedToken.refreshToken,
                    tokenlastrefreshed: new Date()
                };
                return [4 /*yield*/, prisma.accounts.update({
                        where: {
                            username: profile.username,
                        },
                        data: data
                    })];
            case 7:
                _b.sent();
                return [2 /*return*/, refreshedToken];
            case 8:
                _a = _b.sent();
                // If error refreshing token, try and reset it 
                console.log("Error Refreshing Token, Trying to by logging in again...");
                return [4 /*yield*/, exports.reset_account_token(profile)];
            case 9: return [2 /*return*/, _b.sent()];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.get_token_for_account = get_token_for_account;
var reset_account_token = function (profile) { return __awaiter(void 0, void 0, void 0, function () {
    var token, data, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, mcdapi_1.login(profile)];
            case 1:
                token = _a.sent();
                data = {
                    username: profile.username,
                    password: profile.password,
                    accesstoken: token.accessToken,
                    refreshtoken: token.refreshToken,
                    tokenlastrefreshed: new Date(),
                    state: profile.state,
                };
                return [4 /*yield*/, prisma.accounts.findFirst({
                        where: {
                            username: profile.username,
                        }
                    })];
            case 2:
                user = _a.sent();
                if (!(user === null)) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.accounts.create({ data: data })];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.accounts.update({
                    where: {
                        id: user.id
                    },
                    data: data
                })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/, token];
            case 7:
                e_1 = _a.sent();
                console.error(e_1);
                throw new Error("Could not reset account token");
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.reset_account_token = reset_account_token;
var get_profile_db = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.accounts.findFirst({
                    where: {
                        accesstoken: token.accessToken,
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.get_profile_db = get_profile_db;
// Gets all the accounts, and allocates a certain percentage as active
// So that not every account is used every day, so it appears less bot-like
var reallocate_active_accounts = function (percentageActive) { return __awaiter(void 0, void 0, void 0, function () {
    var allAccounts, numSamples, allocatedActiveAccounts, allocatedOutOfRotationAccounts, activeIds, oorIds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Reallocating accounts...");
                if (percentageActive <= 0 || percentageActive > 1) {
                    throw new Error("Invalid percentage active");
                }
                return [4 /*yield*/, prisma.accounts.findMany({
                        where: {
                            state: {
                                in: [AccountState.Active, AccountState.OutOfRotation]
                            }
                        }
                    })];
            case 1:
                allAccounts = _a.sent();
                numSamples = Math.floor(allAccounts.length * percentageActive);
                console.log("Choosing " + numSamples + " account(s) to be active");
                allocatedActiveAccounts = lodash_1.sampleSize(allAccounts, numSamples);
                allocatedOutOfRotationAccounts = lodash_1.difference(allAccounts, allocatedActiveAccounts);
                activeIds = allocatedActiveAccounts.map(function (account) { return account.id; });
                oorIds = allocatedOutOfRotationAccounts.map(function (account) { return account.id; });
                console.log("Accounts Allocated Active:");
                console.log(activeIds);
                console.log("Accounts Allocated OOR:");
                console.log(oorIds);
                if (!(activeIds.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.accounts.updateMany({
                        where: {
                            id: {
                                in: activeIds,
                            }
                        },
                        data: {
                            state: AccountState.Active,
                        }
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (!(oorIds.length > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, prisma.accounts.updateMany({
                        where: {
                            id: {
                                in: oorIds,
                            }
                        },
                        data: {
                            state: AccountState.OutOfRotation
                        }
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: 
            // Update every accounts offers to ensure the ones that are out of rotation get removed
            return [4 /*yield*/, offersmanager_1.obtain_every_account_offers()];
            case 6:
                // Update every accounts offers to ensure the ones that are out of rotation get removed
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.reallocate_active_accounts = reallocate_active_accounts;
var move_out_of_rotation = function (profile) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.accounts.updateMany({
                    where: {
                        username: profile.username,
                    },
                    data: {
                        state: AccountState.OutOfRotation,
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.move_out_of_rotation = move_out_of_rotation;
