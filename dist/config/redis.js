"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_PORT = exports.REDIS_URI = exports.redisClient = void 0;
// config/redis.ts
const ioredis_1 = require("ioredis");
// Create a Redis instance
exports.redisClient = new ioredis_1.Redis({
    host: '127.0.0.1', // REDIS_URI can be used here if needed
    port: 6379, // REDIS_PORT can be used here if needed
    // password: 'your-redis-password', // Use this if Redis is password-protected
});
// Listen for Redis connection events
exports.redisClient.on('connect', () => {
    console.log('Redis client connected');
});
exports.redisClient.on('ready', () => {
    console.log('Redis client is ready to use');
});
exports.redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
exports.redisClient.on('close', () => {
    console.log('Redis connection closed');
});
exports.REDIS_URI = '127.0.0.1';
exports.REDIS_PORT = 6379;
exports.default = {
    REDIS_URI: exports.REDIS_URI,
    REDIS_PORT: exports.REDIS_PORT,
    redisClient: exports.redisClient,
};
