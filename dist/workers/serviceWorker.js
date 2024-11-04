"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
// worker-optimized.ts
const worker_threads_1 = require("worker_threads");
const service_model_1 = require("../modules/services/service.model");
const config_1 = __importDefault(require("../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
function getMongoUrl() {
    if (config_1.default.env === 'development') {
        return config_1.default.database_url;
    }
    else {
        return config_1.default.production_db_url;
    }
}
const url = getMongoUrl() || '';
//server connect
mongoose_1.default.connect(url).then(() => {
    console.log('<===== Database Connected Successfully Yahoo! =====>');
    app_1.default.listen(config_1.default.port, () => {
        console.log(`Listening to port ${config_1.default.port}`);
    });
});
// The function to be executed in the worker thread
async function getAllServices() {
    const total = await service_model_1.ServiceModel.countDocuments();
    return total;
}
// Listen for messages from the main thread
worker_threads_1.parentPort?.on('message', async (message) => {
    try {
        console.log(message);
        const result = await getAllServices();
        worker_threads_1.parentPort?.postMessage(result);
    }
    catch (error) {
        console.log('error from worker thread', error);
        worker_threads_1.parentPort?.postMessage({ error: error.message });
    }
});
