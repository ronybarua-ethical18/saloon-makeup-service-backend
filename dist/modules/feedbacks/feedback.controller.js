'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.FeedbackController = void 0
const tryCatchAsync_1 = __importDefault(require('../../shared/tryCatchAsync'))
const sendResponse_1 = __importDefault(require('../../shared/sendResponse'))
const feedback_service_1 = require('./feedback.service')
const createFeedback = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  const result = await feedback_service_1.FeedbackService.createFeedback(
    loggedUser,
    req.body,
  )
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback is created successfully',
    data: result,
  })
})
const getAllFeedbacks = (0, tryCatchAsync_1.default)(async (req, res) => {
  const result = await feedback_service_1.FeedbackService.getAllFeedbacks()
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'All feedbacks fetched successfully',
    data: result,
  })
})
exports.FeedbackController = {
  createFeedback,
  getAllFeedbacks,
}
