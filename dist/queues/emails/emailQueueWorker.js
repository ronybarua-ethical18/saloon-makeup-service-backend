"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailDispatchQueueWorker = void 0;
// worker.ts
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("../../config/redis"));
const email_utils_1 = require("../utils/email.utils");
function emailDispatchQueueWorker() {
    const worker = new bullmq_1.Worker('emailDispatchQueue', async (job) => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const { subject, payload, template, emailType, mailTrackerPayload, targetEmail, } = job.data.emailPayload;
        await (0, email_utils_1.emailDispatch)(targetEmail, payload, template, subject, emailType, mailTrackerPayload);
        console.log('email payload', job?.data?.emailPayload);
        // await paymentDisbursed(job?.data?.booking)
        // await emailDispatch()
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
exports.emailDispatchQueueWorker = emailDispatchQueueWorker;
