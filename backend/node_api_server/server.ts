// lib/app.ts
import express = require('express');
import { GraphQLClient } from 'graphql-request';
import ApiManager from './src/apiManager';
require('express-async-errors');
const offersRouter = require('./src/middleware/routers/offersRouter');
const imageRouter = require('./src/middleware/routers/imageRouter');
const errorHandler = require('./src/middleware/errorHandler');

global.fetch = require("node-fetch")

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

  setTimeout(() => createAccountsToLimit(maxAccountsNumber), 5000)
});

const createAccountsToLimit = async (maxAccounts: number) => {
  console.log("Account monitor started")
  const api = new ApiManager(new GraphQLClient(process.env.GRAPHQL_ENDPOINT || "", { headers: {} }))

  const allAccounts = await api.getAllAccounts();
  const accountNumDiff = maxAccounts - allAccounts.length;

  console.log(`Max accounts ${maxAccounts}, account diff: ${accountNumDiff}`)

  try {
    if(accountNumDiff > 0) {
      console.log(`Creating ${accountNumDiff} accounts...`)
      const registerPromises = Array.from(Array(accountNumDiff)).map(() => api.createAccount())

      // Run all the registration promises
      Promise.all(registerPromises).then(() => {
        console.log("Accounts created successfully!")
      })
    } else {
        console.log("Account limit reached")
    }
  } catch(error) {
    console.log("Error creating accounts")
    console.log(error)
  }  
}