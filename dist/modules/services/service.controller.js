'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.SaloonServiceController = void 0
const tryCatchAsync_1 = __importDefault(require('../../shared/tryCatchAsync'))
const sendResponse_1 = __importDefault(require('../../shared/sendResponse'))
const mongoose_1 = __importDefault(require('mongoose'))
const service_service_1 = require('./service.service')
const pick_1 = __importDefault(require('../../shared/pick'))
const pagination_1 = require('../../constants/pagination')
const service_constants_1 = require('./service.constants')
const service_model_1 = require('./service.model')
const shop_model_1 = __importDefault(require('../shop/shop.model'))
const createService = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  const result = await service_service_1.SaloonService.createService(
    loggedUser,
    req.body,
  )
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'New service created successfully',
    data: result,
  })
})
const getAllServices = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  const filterOptions = (0, pick_1.default)(
    req.query,
    service_constants_1.filterableFields,
  )
  const queryOptions = (0, pick_1.default)(
    req.query,
    pagination_1.paginationFields,
  )
  const result = await service_service_1.SaloonService.getAllServices(
    loggedUser,
    queryOptions,
    filterOptions,
  )
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'All services fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getService = (0, tryCatchAsync_1.default)(async (req, res) => {
  if (typeof req.params.serviceId === 'string') {
    const result = await service_service_1.SaloonService.getService(
      new mongoose_1.default.Types.ObjectId(req.params['serviceId']),
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: 200,
      success: true,
      message: 'Single service fetched successfully',
      data: result,
    })
  }
})
const updateService = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  if (typeof req.params.serviceId === 'string') {
    const result = await service_service_1.SaloonService.updateService(
      loggedUser,
      new mongoose_1.default.Types.ObjectId(req.params['serviceId']),
      req.body,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: 200,
      success: true,
      message: 'Service updated successfully',
      data: result,
    })
  }
})
const deleteService = (0, tryCatchAsync_1.default)(async (req, res) => {
  const loggedUser = req.user
  if (typeof req.params.serviceId === 'string') {
    await service_service_1.SaloonService.deleteService(
      loggedUser,
      new mongoose_1.default.Types.ObjectId(req.params['serviceId']),
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: 200,
      success: true,
      message: 'Service deleted successfully',
    })
  }
})
const updateManyServices = async (_req, res) => {
  const shops = await shop_model_1.default.find({})
  const services = await service_model_1.ServiceModel.find({})
  Promise.all(
    services.map(async service => {
      const shop = shops.find(
        shop => shop.seller.toString() === service.seller.toString(),
      )
      if (shop) {
        await service_model_1.ServiceModel.findOneAndUpdate(
          { _id: service._id },
          { shop: shop._id },
          { new: true },
        )
      }
    }),
  )
  ;(0, sendResponse_1.default)(res, {
    statusCode: 200,
    success: true,
    message: 'Services updated successfully',
  })
}
exports.SaloonServiceController = {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
  updateManyServices,
}
