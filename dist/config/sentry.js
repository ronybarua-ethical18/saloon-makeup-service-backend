"use strict";
// src/config/sentry.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentrySetContext = exports.SentryCaptureMessage = exports.SentrycaptureException = exports.initSentry = void 0;
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
const initSentry = (app) => {
    Sentry.init({
        dsn: 'https://2b7915e042cb38e990556addb6d8be76@o4508116265861120.ingest.us.sentry.io/4508116269924352',
        integrations: [
            // Add our Profiling integration
            (0, profiling_node_1.nodeProfilingIntegration)(),
        ],
        // Add Tracing by setting tracesSampleRate
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        // Set sampling rate for profiling
        // This is relative to tracesSampleRate
        profilesSampleRate: 1.0,
        debug: true, // Enable debugging for more detailed logs
    });
    Sentry.captureMessage('Sentry is connected!');
    app.use(Sentry.expressErrorHandler());
};
exports.initSentry = initSentry;
exports.SentrycaptureException = Sentry.captureException;
exports.SentryCaptureMessage = Sentry.captureMessage;
exports.SentrySetContext = Sentry.setContext;
