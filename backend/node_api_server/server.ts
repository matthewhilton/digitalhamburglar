// lib/app.ts
import express = require('express');
import ApiManager from 'src/apiManager';
require('express-async-errors');
const offersRouter = require('./src/middleware/routers/offersRouter');
const imageRouter = require('./src/middleware/routers/imageRouter');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment vairables
require('dotenv').config()

const maxAccountsNumber : number = parseInt(process.env.MAX_ACCOUNTS_NUMBER || "") || 0;

// Create a new express application instance
const app: express.Application = express();
var cors = require('cors')
app.use(cors())

app.use(express.static('public'))
app.use('/offers', offersRouter)
// Image routes are disabled temporarily
//app.use('/image', imageRouter)
app.use('/', (req, res) => {
  res.send("It works!")
})
app.use(errorHandler)

app.listen(process.env.PORT, function () {
  console.log('Listening on port ' + process.env.PORT);
});