"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express = require("express");
var offersRouter = require('./src/middleware/routers/offersRouter');
var imageRouter = require('./src/middleware/routers/imageRouter');
// Load environment vairables
require('dotenv').config();
var maxAccountsNumber = parseInt(process.env.MAX_ACCOUNTS_NUMBER || "") || 0;
// Create a new express application instance
var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.static('public'));
app.use('/offers', offersRouter);
app.use('/image', imageRouter);
app.listen(process.env.PORT, function () {
    console.log('Listening on port ' + process.env.PORT);
    //updateAllOffers();
});
