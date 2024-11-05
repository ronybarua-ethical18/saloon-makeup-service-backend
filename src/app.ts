import express, { Application, NextFunction, Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'
import httpStatus from 'http-status'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './errors/globalErrorHandler'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import routes from './routes'
const app: Application = express()

app.use(
  cors({
    origin: '*',
  }),
)

app.options('*', cors());

//parser
app.use(express.json())
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
  res.send('App is working with fully functional booking system feature. Cors origin modified')
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
