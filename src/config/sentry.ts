// src/config/sentry.ts

import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import express from 'express'

export const initSentry = (app: express.Application) => {
  Sentry.init({
    dsn: 'https://2b7915e042cb38e990556addb6d8be76@o4508116265861120.ingest.us.sentry.io/4508116269924352',
    integrations: [
      // Add our Profiling integration
      nodeProfilingIntegration(),
    ],

    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    debug: true, // Enable debugging for more detailed logs
  })

  Sentry.captureMessage('Sentry is connected!');
  app.use(Sentry.expressErrorHandler());
}


export const SentrycaptureException = Sentry.captureException
export const SentryCaptureMessage = Sentry.captureMessage
export const SentrySetContext = Sentry.setContext
