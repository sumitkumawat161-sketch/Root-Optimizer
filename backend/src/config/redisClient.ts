import Redis from "ioredis";
import { env } from "./env";

const redisClient = new Redis(env.redisUrl);

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

export default redisClient;
