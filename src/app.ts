import express, { Application, NextFunction, Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'
import httpStatus from 'http-status'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './errors/globalErrorHandler'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import routes from './routes'
import { initSentry, SentryCaptureMessage } from './config/sentry'
const app: Application = express()

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin || origin === undefined) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type', 'Origin', 'Accept'], // Add Authorization here
  })
);


declare module 'http' {
  interface IncomingMessage {
    rawBody?: string | object | unknown
  }
}
// Initialize Sentry
initSentry(app);

// Test Sentry connection
app.get('/api/v1/test-sentry', (req, res) => {
  SentryCaptureMessage('Testing Sentry connection');
  res.send('Test Sentry triggered');
});

//parser
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString()
    },
  }),
)
app.use(express.urlencoded({ extended: true }))

//cookie parser
app.use(cookieParser())

// logger
app.use(logger('dev'))

// Enhancing Express.js security with Helmet middleware for essential HTTP header protection.
app.use(helmet())

// sanitize request data to remove unwanted characters from req.body, req.query, req.params ($, . etc ..)
app.use(ExpressMongoSanitize())

// application routes
app.use('/api/v1', routes)

//Testing
app.get('/', async (req: Request, res: Response) => {
  res.send(
    'Working Successfully With github actions with both preview and production mode',
  )
})

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})
app.use(globalErrorHandler)

export default app
