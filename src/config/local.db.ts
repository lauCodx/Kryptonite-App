import { ErrorRequestHandler } from "express";
import * as redis from "redis"

const client: string | any = redis.createClient();

(async() =>{
  await client.connect();
})();

client.on('error', (err:ErrorRequestHandler) =>{
  console.log("Something went wrong " + err)
})

export default client