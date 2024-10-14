// config/redis.ts
import { Redis } from 'ioredis';

// Create a Redis instance
export const redisClient = new Redis({
  host: '127.0.0.1', // REDIS_URI can be used here if needed
  port: 6379,        // REDIS_PORT can be used here if needed
  // password: 'your-redis-password', // Use this if Redis is password-protected
});


// Listen for Redis connection events
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('ready', () => {
  console.log('Redis client is ready to use');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('close', () => {
  console.log('Redis connection closed');
});

export const REDIS_URI = '127.0.0.1';
export const REDIS_PORT = 6379;

export default {
  REDIS_URI,
  REDIS_PORT,
  redisClient,
};
