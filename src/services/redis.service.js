'use strict'

const Redis = require('ioredis');

console.log('IORedis module loaded');

// Use 'host.docker.internal' to connect to a Docker container from the host machine
const redisHost = process.env.REDIS_HOST || 'host.docker.internal';
const redisPort = process.env.REDIS_PORT || 6379;

console.log(`Attempting to connect to Redis at ${redisHost}:${redisPort}`);

const redisClient = new Redis({
    host: redisHost,
    port: redisPort,
    retryStrategy(times) {
        console.log(`Retry attempt ${times}`);
        if (times > 10) {
            console.error('Redis connection refused. Check if Redis is running and the host/port are correct.');
            return null; // stop retrying
        }
        return Math.min(times * 100, 3000);
    }
});

redisClient.on('connect', () => {
    console.log('Redis client received connect event');
});

redisClient.on('ready', () => {
    console.log('Redis client is ready');
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('close', () => {
    console.log('Redis connection closed');
});

// Test the connection
redisClient.ping().then((result) => {
    console.log('Redis PING successful, result:', result);
}).catch((err) => {
    console.error('Error pinging Redis:', err);
});

const acquireLock = async (productId, quantity, cardId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;
    for (let i = 0; i < retryTimes; i++) {
        const result = await redisClient.setnx(key, expireTime);
        console.log(`result:::`, result);
        if (result === 1) {
            return key;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
    return null;
}

const releaseLock = async keyLock => {
    return await redisClient.del(keyLock);
}

module.exports = {
    redisClient,
    acquireLock,
    releaseLock
}