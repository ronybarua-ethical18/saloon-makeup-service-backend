"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
// worker-optimized.ts
const worker_threads_1 = require("worker_threads");
const service_model_1 = require("../modules/services/service.model");
// The function to be executed in the worker thread
async function getAllServices(queryPayload, sortCondition, skip, limit) {
    const services = await service_model_1.ServiceModel.find(queryPayload)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    return services;
}
// Listen for messages from the main thread
worker_threads_1.parentPort?.on('message', async (message) => {
    try {
        const { queryPayload, sortCondition, skip, limit } = message;
        const result = await getAllServices(queryPayload, sortCondition, skip, limit);
        worker_threads_1.parentPort?.postMessage(result);
    }
    catch (error) {
        console.log("error from worker thread", error);
        worker_threads_1.parentPort?.postMessage({ error: error.message });
    }
});
