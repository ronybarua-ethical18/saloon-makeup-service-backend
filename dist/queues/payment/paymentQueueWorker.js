"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentDispatchQueueWorker = void 0;
// worker.ts
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("../../config/redis"));
const payment_utils_1 = require("../utils/payment.utils");
function paymentDispatchQueueWorker() {
    const worker = new bullmq_1.Worker('paymentDispatchQueue', async (job) => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await (0, payment_utils_1.paymentDisbursed)(job?.data?.booking);
    }, {
        connection: {
            host: redis_1.default.REDIS_URI,
            port: redis_1.default.REDIS_PORT,
        },
        concurrency: 1,
        autorun: true,
    });
    worker.on('completed', async (job) => {
        console.log('Completed job with order id: ' + job.id);
    });
    worker.on('failed', async (job) => {
        if (job) {
            console.log('failed job with booking id:', job.data?.booking?.bookingId);
        }
        else {
            console.debug('Job failed, but no job information available.');
        }
    });
}
exports.paymentDispatchQueueWorker = paymentDispatchQueueWorker;
