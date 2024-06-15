'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const path_1 = __importDefault(require('path'))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path_1.default.resolve(__dirname, 'templates'),
    defaultLayout: false,
  },
  viewPath: path_1.default.resolve(__dirname, 'templates'),
  extName: '.handlebars',
}
exports.default = handlebarOptions
