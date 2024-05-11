'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.FAQController = void 0
const tryCatchAsync_1 = __importDefault(require('../../shared/tryCatchAsync'))
const sendResponse_1 = __importDefault(require('../../shared/sendResponse'))
const faq_service_1 = require('./faq.service')
const createFAQ = (0, tryCatchAsync_1.default)(async (req, res) => {
  const result = await faq_service_1.FAQService.createFAQ(req.body)
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ is created successfully',
    data: result,
  })
})
const getAllFaqs = (0, tryCatchAsync_1.default)(async (_req, res) => {
  const result = await faq_service_1.FAQService.getAllFaqs()
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'All faqs fetched successfully',
    data: result,
  })
})
exports.FAQController = {
  createFAQ,
  getAllFaqs,
}
