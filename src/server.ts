import mongoose from 'mongoose'
import config from './config/index'
import app from './app'
import ApiError from './errors/ApiError'
import http from 'http'
// import { redis } from './config/redis'

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
  console.log('<===== Database Connected Successfully Yahoo! =====>')
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

// redis connect
// redis.on('connect', () =>{
//   console.log('Redis connected')
// })

//  redis.set("test", JSON.stringify({test:"Test value 2"}))

const unexpectedErrorHandler = (error: string) => {
  serverExitHandler()
  throw new ApiError(500, error)
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  console.log('SIGTERM received')
  if (server) {
    server.close()
  }
})
