"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJobToPaymentDispatchQueue = exports.paymentDispatchQueue = void 0;
// queue.ts
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const paymentQueueWorker_1 = require("./paymentQueueWorker");
exports.paymentDispatchQueue = new bullmq_1.Queue('paymentDispatchQueue', {
    connection: redis_1.redisClient
});
const DEFAULT_CONFIG = {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: true,
    // delay: 5000,
};
async function addJobToPaymentDispatchQueue(data) {
    // console.log("paypal data", data);
    return exports.paymentDispatchQueue.add('job', { booking: data }, DEFAULT_CONFIG);
}
exports.addJobToPaymentDispatchQueue = addJobToPaymentDispatchQueue;
(0, paymentQueueWorker_1.paymentDispatchQueueWorker)();
