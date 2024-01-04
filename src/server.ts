import mongoose from 'mongoose'
import config from './config/index'
import app from './app'
import ApiError from './errors/ApiError'
import http from 'http'

let server: http.Server

function getMongoUrl() {
  if (config.env === 'development') {
    return config.database_url
  } else {
    return config.production_db_url
  }
}

const url: string = getMongoUrl() || ''

//server connect
mongoose.connect(url).then(() => {
  console.log('<===== Database Connected Successfully =====>')
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`)
  })
})
const serverExitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: string) => {
  throw new ApiError(500, error)
  serverExitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  console.log('SIGTERM received')
  if (server) {
    server.close()
  }
})
