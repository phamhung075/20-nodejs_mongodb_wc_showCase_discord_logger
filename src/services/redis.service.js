"use strict";

const Redis = require("ioredis");

console.log("IORedis module loaded");

const redisConfig = {
  host: "localhost", // Try localhost since we bound to 0.0.0.0
  port: 6379,
  connectTimeout: 10000,
  enableReadyCheck: true,
  autoResubscribe: false,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    console.log(`Retry attempt ${times}, delaying ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: 5,
};

console.log(
  `Attempting to connect to Redis at ${redisConfig.host}:${redisConfig.port}`
);

const redisClient = new Redis(redisConfig);

redisClient.on("connect", () => {
  console.log("Socket connected");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", {
    message: err.message,
    code: err.code,
    syscall: err.syscall,
    errno: err.errno,
    stack: err.stack,
  });
});

// Test connection with timeout
setTimeout(() => {
  console.log("Attempting ping...");
  redisClient
    .ping()
    .then((result) => console.log("Ping result:", result))
    .catch((err) => console.error("Ping failed:", err));
}, 1000);
