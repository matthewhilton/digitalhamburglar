import Koa from 'koa';
import Router from "@koa/router";
import dotenv from 'dotenv';
import cors from '@koa/cors';
import cron from "node-cron";
import { Profile } from './interfaces';
import { get_token_for_account, reallocate_active_accounts, reset_account_token } from './loginmanager';
import { convert_offer_for_api, decryptToken, get_account_offers, get_all_offers, get_offer_by_id, get_offer_code, get_offer_redemption_key, JWTPayload, obtain_every_account_offers, OfferState, offer_available, save_entire_offers, temp_redeem_offer, verify_redemption_key } from './offersmanager';

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

router.get('/offers/redeem', async (ctx) => {
  const offerToken = ctx.request.query.offerToken
  ctx.assert(offerToken !== undefined, 400, 'Required parameter offerToken not given.');

  const offerAvailable = await offer_available(offerToken);
  console.log(`Offer ${offerToken} is available: ${offerAvailable}`);
  ctx.assert(offerAvailable, 400, 'Offer not available to be redeemed');
  
  const offerRedemptionKey = await get_offer_redemption_key(offerToken);

  const tokenDecrypted = await decryptToken(offerToken)
  const offerId = Number(tokenDecrypted.split('|')[0])
  const offer = await get_offer_by_id(offerId)

  // Mark offer temporarily redeemed 
  await temp_redeem_offer(offer, Number(process.env.OFFER_TEMP_REDEMPTION_TIME))

  ctx.body = { key: offerRedemptionKey}
})

router.get('/offers/code', async (ctx) => {
  const redemptionKey = ctx.request.query.redemptionKey
  ctx.assert(redemptionKey !== undefined, 400, 'Required parameter redemptionKey not given.');
  
  // Verify redemption key (both valid contents and expiration time)
  const key = await verify_redemption_key(redemptionKey)
  ctx.assert(key !== false, 403, 'Redemption key could not be validated. Either invalid or expired.');

  // Token valid, get data and code
  const keyPayload = key as JWTPayload;

  const tokenDecrypted = await decryptToken(keyPayload.data)
  const offerId = Number(tokenDecrypted.split('|')[0])
  const offer = await get_offer_by_id(offerId)

  const offerCode = await get_offer_code(offer)
  ctx.body = offerCode
})

router.get('/details', async (ctx) => {
  const offerToken = ctx.request.query.offerToken
  
  try {
    const tokenDecrypted = await decryptToken(offerToken)
    const offerId = Number(tokenDecrypted.split('|')[0])
    const offer = await get_offer_by_id(offerId)
    ctx.body = await convert_offer_for_api(offer)
  } catch(e) {
    console.log(`Error getting offer with token ${offerToken}`)
    console.error(e)
    ctx.body = "Error getting offer details"
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

app.use(cors())
app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);