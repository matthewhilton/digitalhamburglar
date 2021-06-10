import Koa from 'koa';
import Router from "@koa/router";
import dotenv from 'dotenv';
import { Profile } from './interfaces'
import { get_token_for_account, reallocate_active_accounts, reset_account_token } from './loginmanager';
import { get_account_offers } from './offersmanager';

// Load Server
const app = new Koa();
const router = new Router();

// Load environment variables.
dotenv.config()

const testProfile: Profile = {
    username: '950f96d35194ac6789e5@sharklasers.com',
    password: 'A119b740',
    id: 0,
    state: 1,
}

router.get('/', async (ctx) => {
  ctx.body = await get_account_offers(testProfile)
})

router.get('/reset', async (ctx) => {
  try {
    ctx.body = await reset_account_token(testProfile)
  } catch(e) {
    console.error(e)
    ctx.body = "Could not reset"
  }  
})

router.get('/allocate', async (ctx) => {
  await reallocate_active_accounts(0.8)
  ctx.body = "done"
})

app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000);