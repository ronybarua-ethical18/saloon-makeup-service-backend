"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const createWorker = () => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, './serviceWorker.ts'), {
            execArgv: ['-r', 'ts-node/register'],
            workerData: { thread_count: 2 },
        });
        // send a message from the main thread to the worker thread  if necessary
        // worker.postMessage({ queryPayload, sortCondition, skip, limit });
        worker.on('message', data => {
            resolve(data);
        });
        worker.on('error', err => {
            reject(`An error occured ${err}`);
        });
        worker.on('exit', code => {
            if (code !== 0) {
                reject(`Worker stopped with exit code ${code}`);
            }
        });
    });
};
exports.createWorker = createWorker;
