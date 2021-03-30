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
var crypto_1 = __importDefault(require("crypto"));
var AccountManager = /** @class */ (function () {
    function AccountManager(db, api) {
        this.db = db;
        this.api = api;
    }
    AccountManager.prototype.randomDisposableEmail = function () {
        return crypto_1.default.randomBytes(8).toString('hex') + "@sharklasers.com";
    };
    AccountManager.prototype.randomCompliantPassword = function () {
        // Passwords need at least 6 letters, one uppercase and 1 number.
        return "A1" + crypto_1.default.randomBytes(3).toString('hex');
    };
    AccountManager.prototype.fillToMaxAccounts = function (maxAccounts) {
        var _this = this;
        // First count the number of accounts that are marked as 'active'
        this.db.find({ active: true }, function (err, docs) {
            var difference = maxAccounts - docs.length;
            console.log("Set to " + maxAccounts + " accounts.");
            console.log("There are currently " + docs.length + " accounts.");
            console.log("Difference: " + difference);
            if (difference > 0) {
                var _loop_1 = function () {
                    // Will try to register using this random email address
                    // there is a small chance the email address has already been registered
                    // in that case, the number of accounts will simply be not completely accurate
                    // this doesn't really matter, however, as accounts are not created that often
                    var username = _this.randomDisposableEmail();
                    var password = _this.randomCompliantPassword();
                    // Delay each registration by a bit of time to avoid rate limiting
                    setTimeout(function () {
                        _this.api.register(username, password).then(function (token) {
                            console.log("Account registered successfully!\n Username: ", username, " Password: ", password);
                            console.log(token);
                            // Save this account to the database
                            _this.db.insert({ username: username, password: password, active: true });
                        }).catch(function (e) {
                            console.log("Error when registering account: ", e);
                        });
                        // Rate limit to 5 second intervals
                    }, 10 * i);
                };
                for (var i = 0; i < difference; i++) {
                    _loop_1();
                }
            }
            return;
        });
    };
    AccountManager.prototype.getAccounts = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.find({}, function (err, docs) {
                if (err)
                    return reject(err);
                return resolve(docs);
            });
        });
    };
    AccountManager.prototype.getEveryAccountOffer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getAccounts().then(function (accounts) {
                var offers = [];
                // Iterate through each account and get offers
                var promiseArray = [];
                var i = 0;
                var promiseResolveDelayFactor = 20;
                var _loop_2 = function (account) {
                    i += 1;
                    // Create an array of promises that resolve to get offers from each account
                    promiseArray.push(new Promise(function (res, rej) {
                        setTimeout(function () {
                            console.log("Getting offers for account " + account.username);
                            _this.api.getOffers({ username: account.username, password: account.password }).then(function (offers) {
                                console.log("Offer success for " + account.username);
                                res(offers);
                            }).catch(function (e) { return rej(e); });
                        }, i * promiseResolveDelayFactor);
                    }));
                };
                for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
                    var account = accounts_1[_i];
                    _loop_2(account);
                }
                Promise.all(promiseArray).then(function (result) {
                    // Destruct the outer array
                    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                        var resultArray = result_1[_i];
                        var thisOffer = resultArray;
                        //console.log("THis offer", thisOffer)
                        if (thisOffer != null) {
                            offers = __spreadArrays(offers, thisOffer);
                        }
                    }
                    resolve(offers);
                }).catch(function (e) { return reject(e); });
            }).catch(function (e) { return reject(e); });
        });
    };
    return AccountManager;
}());
exports.default = AccountManager;
