"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
var asciiImageConvert_1 = __importDefault(require("../../asciiImageConvert"));
var sha256_1 = __importDefault(require("crypto-js/sha256"));
require('dotenv').config();
var fs = require('fs');
var request = require('request');
var express = require('express');
var router = express.Router();
var path = require('path');
// List of offers in simple format
router.get('/ascii', function (req, res, next) {
    var base_url = "https://au-prod-us-cds-oceofferimages.s3.amazonaws.com/oce3-au-prod/offers/";
    // TODO add key checks
    var image_key = req.query.image;
    if (image_key == null || image_key == undefined || image_key == "undefined") {
        console.log("Image key was undefined");
        return res.status(400, "Image was null");
    }
    var url = base_url + image_key;
    var image_hash = sha256_1.default(url).toString();
    console.log(image_key + " => " + image_hash);
    // See if file has been cached in public directory
    try {
        if (fs.existsSync(path.resolve('public', 'offerImages', image_hash + '.png'))) {
            // Exists already, so redirect to file 
            console.log("Image cached " + image_hash);
            redirectToPublic(res, image_hash);
        }
        else {
            // Image doens't exist, have to convert and store in public then redirect
            asciiImageConvert_1.default(url, image_hash).then(function (path) {
                console.log(path);
                redirectToPublic(res, image_hash);
            }).catch(function () { return res.status(500); });
        }
    }
    catch (_a) {
        return res.status(500);
    }
});
var redirectToPublic = function (res, image_hash) {
    res
        .status(200)
        .redirect(307, '/offerImages/' + image_hash + '.png');
};
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
exports.download = download;
module.exports = router;
