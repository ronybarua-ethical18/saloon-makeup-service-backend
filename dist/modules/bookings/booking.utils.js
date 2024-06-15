'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.areBothTimesInBetween = exports.bookingsAggregationPipeline = void 0
const moment_1 = __importDefault(require('moment'))
const bookingsAggregationPipeline = nameRegex => {
  return [
    {
      $lookup: {
        from: 'users',
        localField: 'customer',
        foreignField: '_id',
        as: 'customerInfo',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'seller',
        foreignField: '_id',
        as: 'sellerInfo',
      },
    },
    {
      $lookup: {
        from: 'services',
        localField: 'serviceId',
        foreignField: '_id',
        as: 'serviceInfo',
      },
    },
    {
      $lookup: {
        from: 'shops',
        localField: 'shop',
        foreignField: '_id',
        as: 'shopInfo',
      },
    },
    {
      $unwind: '$customerInfo',
    },
    {
      $unwind: '$sellerInfo',
    },
    {
      $unwind: '$serviceInfo',
    },
    {
      $unwind: '$shopInfo',
    },
    {
      $match: {
        $or: [
          { 'customerInfo.firstName': { $regex: nameRegex } },
          { 'customerInfo.lastName': { $regex: nameRegex } },
          { 'sellerInfo.firstName': { $regex: nameRegex } },
          { 'sellerInfo.lastName': { $regex: nameRegex } },
          { 'serviceInfo.name': { $regex: nameRegex } },
          { 'shopInfo.shopName': { $regex: nameRegex } },
        ],
      },
    },
  ]
}
exports.bookingsAggregationPipeline = bookingsAggregationPipeline
const areBothTimesInBetween = (
  startTime,
  endTime,
  openingHour,
  closingHour,
) => {
  const time1 = (0, moment_1.default)(startTime, 'HH:mm')
  const time2 = (0, moment_1.default)(endTime, 'HH:mm')
  const openingTime = (0, moment_1.default)(openingHour, 'HH:mm')
  const closingTime = (0, moment_1.default)(closingHour, 'HH:mm')
  return (
    time1.isBetween(openingTime, closingTime, null, '[]') &&
    time2.isBetween(openingTime, closingTime, null, '[]')
  )
}
exports.areBothTimesInBetween = areBothTimesInBetween
