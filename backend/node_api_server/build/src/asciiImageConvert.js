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
var imageRouter_1 = require("./middleware/routers/imageRouter");
var path = require('path');
var uuid_1 = require("uuid");
var fs = require('fs');
var puppeteer = require('puppeteer');
var sharp = require('sharp');
// Use an online website and pupeteer to asciify a given image (and return an image - NOT a text string like many libraries do)
function asciiImageConvert(image_url, hash) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var image_temp_name, temp_image_path_1;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    image_temp_name = uuid_1.v4() + '.png';
                    temp_image_path_1 = path.join(__dirname, image_temp_name);
                    imageRouter_1.download(image_url, temp_image_path_1, function () {
                        console.log("starting browser");
                        console.log("Using temp path: ", temp_image_path_1);
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            var browser, page, elementHandle, btn, text_button, braile_button, color_btn, bow, color_done, svgImage, image_save_path;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, puppeteer.launch({ defaultViewport: null, headless: true, args: [
                                                "--disable-notifications"
                                            ] })];
                                    case 1:
                                        browser = _a.sent();
                                        return [4 /*yield*/, browser.newPage()];
                                    case 2:
                                        page = _a.sent();
                                        return [4 /*yield*/, page.setViewport({ width: 1600, height: 1600, deviceScaleFactor: 1 })];
                                    case 3:
                                        _a.sent();
                                        page.on('dialog', function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        console.log(dialog.message());
                                                        return [4 /*yield*/, dialog.dismiss()];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [4 /*yield*/, page.goto('https://asciiart.club/')];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, delay(2000)];
                                    case 5:
                                        _a.sent();
                                        return [4 /*yield*/, page.$("input[type=file]")];
                                    case 6:
                                        elementHandle = _a.sent();
                                        return [4 /*yield*/, elementHandle.uploadFile(temp_image_path_1)];
                                    case 7:
                                        _a.sent();
                                        return [4 /*yield*/, delay(10000)];
                                    case 8:
                                        _a.sent();
                                        return [4 /*yield*/, page.waitForSelector('#getfilego')];
                                    case 9:
                                        _a.sent();
                                        return [4 /*yield*/, page.$('#getfilego')];
                                    case 10:
                                        btn = _a.sent();
                                        return [4 /*yield*/, btn.evaluate(function (btn) { return btn.click(); })];
                                    case 11:
                                        _a.sent();
                                        delay(500);
                                        return [4 /*yield*/, btn.evaluate(function (btn) { return btn.click(); })];
                                    case 12:
                                        _a.sent();
                                        return [4 /*yield*/, page.waitForSelector('#iout')];
                                    case 13:
                                        _a.sent();
                                        return [4 /*yield*/, delay(500)];
                                    case 14:
                                        _a.sent();
                                        return [4 /*yield*/, page.$('#charbtn')];
                                    case 15:
                                        text_button = _a.sent();
                                        return [4 /*yield*/, text_button.evaluate(function (text_button) { return text_button.click(); })];
                                    case 16:
                                        _a.sent();
                                        return [4 /*yield*/, delay(500)];
                                    case 17:
                                        _a.sent();
                                        return [4 /*yield*/, page.$('label[for="tradio4"]')];
                                    case 18:
                                        braile_button = _a.sent();
                                        return [4 /*yield*/, braile_button.evaluate(function (braile_button) { return braile_button.click(); })];
                                    case 19:
                                        _a.sent();
                                        return [4 /*yield*/, delay(500)];
                                    case 20:
                                        _a.sent();
                                        return [4 /*yield*/, page.evaluate(function () { var _a; return (_a = document.querySelector('input[name="charsdone"]')) === null || _a === void 0 ? void 0 : _a.scrollIntoView(); })];
                                    case 21:
                                        _a.sent();
                                        return [4 /*yield*/, page.$eval('input[name="charsdone"]', function (elem) { return elem.click(); })];
                                    case 22:
                                        _a.sent();
                                        return [4 /*yield*/, delay(500)];
                                    case 23:
                                        _a.sent();
                                        return [4 /*yield*/, page.$('#colorbtn')];
                                    case 24:
                                        color_btn = _a.sent();
                                        return [4 /*yield*/, color_btn.evaluate(function (color_btn) { return color_btn.click(); })];
                                    case 25:
                                        _a.sent();
                                        return [4 /*yield*/, delay(500)];
                                    case 26:
                                        _a.sent();
                                        return [4 /*yield*/, page.$('label[for="cradio1"]')];
                                    case 27:
                                        bow = _a.sent();
                                        return [4 /*yield*/, bow.evaluate(function (bow) { return bow.click(); })];
                                    case 28:
                                        _a.sent();
                                        return [4 /*yield*/, delay(1000)];
                                    case 29:
                                        _a.sent();
                                        return [4 /*yield*/, page.$('#colorsdone')];
                                    case 30:
                                        color_done = _a.sent();
                                        return [4 /*yield*/, color_done.evaluate(function (color_done) { return color_done.click(); })];
                                    case 31:
                                        _a.sent();
                                        console.log("waiting for image to load before taking screenshot");
                                        return [4 /*yield*/, delay(5000)];
                                    case 32:
                                        _a.sent();
                                        return [4 /*yield*/, page.waitForSelector('#iout')];
                                    case 33:
                                        _a.sent();
                                        return [4 /*yield*/, page.evaluate(function () { var _a; return (_a = document.querySelector('#iout')) === null || _a === void 0 ? void 0 : _a.scrollIntoView(); })];
                                    case 34:
                                        _a.sent();
                                        return [4 /*yield*/, page.$('#iout')];
                                    case 35:
                                        svgImage = _a.sent();
                                        return [4 /*yield*/, delay(2000)];
                                    case 36:
                                        _a.sent();
                                        return [4 /*yield*/, svgImage.screenshot({
                                                path: temp_image_path_1,
                                                omitBackground: true,
                                            })];
                                    case 37:
                                        _a.sent();
                                        return [4 /*yield*/, delay(2000)];
                                    case 38:
                                        _a.sent();
                                        return [4 /*yield*/, browser.close()];
                                    case 39:
                                        _a.sent();
                                        image_save_path = path.resolve('public', 'offerImages', hash + '.png');
                                        sharp(temp_image_path_1)
                                            .extract({ width: 350, height: 350, left: 30, top: 30 })
                                            .tint("green")
                                            .toFile(image_save_path)
                                            .then(function () {
                                            // Delete temp image
                                            fs.unlinkSync(temp_image_path_1);
                                            resolve(image_save_path);
                                        })
                                            .catch(function (err) {
                                            reject(err);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                    });
                }
                catch (_b) {
                    reject("Error when converting image");
                }
                return [2 /*return*/];
            });
        }); })();
    });
}
exports.default = asciiImageConvert;
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
