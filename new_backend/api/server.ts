import Koa from 'koa';
import Router from "@koa/router";
import dotenv from 'dotenv';
import cron from "node-cron"
import { Profile } from './interfaces'
import { get_token_for_account, reallocate_active_accounts, reset_account_token } from './loginmanager';
import { convert_offer_for_api, decryptToken, get_account_offers, get_all_offers, get_offer_by_id, obtain_every_account_offers, OfferState, redeem_offer, save_entire_offers, temp_redeem_offer } from './offersmanager';

// Load Server
const app = new Koa();
const router = new Router();

// Load environment variables.
dotenv.config()

router.get('/offers', async (ctx) => {
  const allOffers = await get_all_offers();

  // Filter offers that are available and not temporarily redeemed
  const offersAvailable = await allOffers.filter(offer => offer.state === OfferState.available);
  const offersToReturn = await Promise.all(offersAvailable.map(convert_offer_for_api))

  ctx.body = offersToReturn;
})

router.get('/redeem', async (ctx) => {
  const offerToken = ctx.request.query.offerToken
  
  try {
    ctx.body = await redeem_offer(offerToken)
  } catch(e) {
    console.log(`Error getting offer with token ${offerToken}`)
    console.error(e)
    ctx.body = "Error redeeming offer"
  }
})

// Account re-allocation happens at 2am every day, or whenever the server is reset
//reallocate_active_accounts(0.75)
cron.schedule('0 2 * * *', () => {
  reallocate_active_accounts(0.75)
})

// Offer checking interval - every hour or whenver the server is reset
//obtain_every_account_offers()
cron.schedule('2 * * * *', () => {
  obtain_every_account_offers()
})

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);