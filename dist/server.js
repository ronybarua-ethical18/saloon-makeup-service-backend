'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const mongoose_1 = __importDefault(require('mongoose'))
const index_1 = __importDefault(require('./config/index'))
const app_1 = __importDefault(require('./app'))
const ApiError_1 = __importDefault(require('./errors/ApiError'))
let server
function getMongoUrl() {
  if (index_1.default.env === 'development') {
    return index_1.default.database_url
  } else {
    return index_1.default.production_db_url
  }
}
const url = getMongoUrl() || ''
//server connect
mongoose_1.default.connect(url).then(() => {
  console.log('<===== Database Connected Successfully Yahoo! =====>')
  server = app_1.default.listen(index_1.default.port, () => {
    console.log(`Listening to port ${index_1.default.port}`)
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
const unexpectedErrorHandler = error => {
  serverExitHandler()
  throw new ApiError_1.default(500, error)
}
process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)
process.on('SIGTERM', () => {
  console.log('SIGTERM received')
  if (server) {
    server.close()
  }
})
