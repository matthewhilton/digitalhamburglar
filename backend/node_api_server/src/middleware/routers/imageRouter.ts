import asciiImageConvert from "../../asciiImageConvert";
import sha256 from 'crypto-js/sha256';

require('dotenv').config()

const fs = require('fs');
const request = require('request');
const express = require('express');
const router = express.Router();
const path = require('path')

// List of offers in simple format
router.get('/ascii', (req, res, next) => {
    const base_url = "https://au-prod-us-cds-oceofferimages.s3.amazonaws.com/oce3-au-prod/offers/"
    
    // TODO add key checks
    const image_key = req.query.image

    if(!image_key || image_key == "undefined"){
        console.log("Image key was undefined")
        return res.status(400, "Image was null")
    }

    const url = base_url + image_key

    const image_hash = sha256(url).toString() 
    console.log(image_key + " => " + image_hash)

    // See if file has been cached in public directory
    try {
        if (fs.existsSync(path.resolve('public', 'offerImages', image_hash + '.png'))){
            // Exists already, so redirect to file 
            console.log("Image cached " + image_hash)
            redirectToPublic(res, image_hash)
        } else {
            // Image doens't exist, have to convert and store in public then redirect
            asciiImageConvert(url, image_hash).then((path) => {
                console.log(path)
                redirectToPublic(res, image_hash)
            }).catch(() => res.status(500))
        }
    } catch {
        return res.status(500);
    }
})

const redirectToPublic = (res, image_hash: string) => {
    res
    .status(200)
    .redirect(307, '/offerImages/' + image_hash + '.png')
}

export var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  

module.exports = router;
