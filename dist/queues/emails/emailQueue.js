"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJobToEmailDispatchQueue = exports.emailDispatchQueue = void 0;
// queue.ts
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const emailQueueWorker_1 = require("./emailQueueWorker");
exports.emailDispatchQueue = new bullmq_1.Queue('emailDispatchQueue', {
    connection: redis_1.redisClient
});
const DEFAULT_CONFIG = {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: true,
    // delay: 5000,
};
async function addJobToEmailDispatchQueue(data) {
    // console.log("paypal data", data);
    return exports.emailDispatchQueue.add('job', { emailPayload: data }, DEFAULT_CONFIG);
}
exports.addJobToEmailDispatchQueue = addJobToEmailDispatchQueue;
(0, emailQueueWorker_1.emailDispatchQueueWorker)();
