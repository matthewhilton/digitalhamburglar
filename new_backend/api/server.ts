import Koa from 'koa';
import Router from "@koa/router";
import dotenv from 'dotenv';
import { Profile } from './interfaces'
import { get_token_for_account, reset_account_token } from './loginmanager';

// Load Server
const app = new Koa();
const router = new Router();

// Load environment variables.
dotenv.config()

const testProfile:Profile = {
  username: '12345678a@sharklasers.com',
  password: 'pizzaTime1',
  created: new Date(),
  id: 0
}

router.get('/', async (ctx) => {
  ctx.body = await get_token_for_account(testProfile)
})

router.get('/reset', async (ctx) => {
  ctx.body = await reset_account_token(testProfile)
})

app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000);