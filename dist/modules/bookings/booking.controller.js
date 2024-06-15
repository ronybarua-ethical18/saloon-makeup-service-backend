'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.BookingController = void 0
const tryCatchAsync_1 = __importDefault(require('../../shared/tryCatchAsync'))
const sendResponse_1 = __importDefault(require('../../shared/sendResponse'))
const mongoose_1 = __importDefault(require('mongoose'))
const booking_service_1 = require('./booking.service')
const pick_1 = __importDefault(require('../../shared/pick'))
const pagination_1 = require('../../constants/pagination')
const createBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  const result = await booking_service_1.SaloonService.createBooking(
    loggedUser,
    req.body,
  )
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'New Booking is created successfully',
    data: result,
  })
})
const getAllBookings = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  const filterOptions = (0, pick_1.default)(req.query, ['searchTerm'])
  const queryOptions = (0, pick_1.default)(
    req.query,
    pagination_1.paginationFields,
  )
  const result = await booking_service_1.SaloonService.getAllBookings(
    loggedUser,
    queryOptions,
    filterOptions,
  )
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'All bookings fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
  if (typeof req.params.bookingId === 'string') {
    const result = await booking_service_1.SaloonService.getBooking(
      new mongoose_1.default.Types.ObjectId(req.params['bookingId']),
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: 200,
      success: true,
      message: 'Single booking fetched successfully',
      data: result,
    })
  }
})
const updateBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  if (typeof req.params.bookingId === 'string') {
    const result = await booking_service_1.SaloonService.updateBooking(
      loggedUser,
      new mongoose_1.default.Types.ObjectId(req.params['bookingId']),
      req.body,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: 200,
      success: true,
      message: 'Booking updated successfully',
      data: result,
    })
  }
})
const deleteBooking = (0, tryCatchAsync_1.default)(async (req, res) => {
  if (typeof req.params.bookingId === 'string') {
    await booking_service_1.SaloonService.deleteBooking(
      new mongoose_1.default.Types.ObjectId(req.params['bookingId']),
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: 200,
      success: true,
      message: 'Booking deleted successfully',
    })
  }
})
exports.BookingController = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
}
