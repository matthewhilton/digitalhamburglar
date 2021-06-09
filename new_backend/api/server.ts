import Koa from 'koa';
import dotenv from 'dotenv';
import { login, refreshToken } from "./mcdapi"
import { Profile } from './interfaces'
import jwt_decode from "jwt-decode";

// Load Server
const app = new Koa();

// Load environment variables.
dotenv.config()

import getDatabase from "./db";
const db_conn = getDatabase();

app.use(async ctx => {
  const testProfile:Profile = {
    username: '12345678a@sharklasers.com',
    password: 'pizzaTime1',
    created: new Date(),
    id: 0
  }
  const token = await login(testProfile)
  
  console.log("logged in with token")
  console.log(token)

  const refreshedToken = await refreshToken(token)

  console.log("New token")
  console.log(refreshedToken)

  ctx.body = refreshedToken
})


app.listen(3000);