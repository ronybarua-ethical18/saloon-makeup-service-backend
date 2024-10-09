/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../errors/ApiError'
import { IService, ServiceStatusList } from './service.interface'
import { ServiceModel } from './service.model'
import { JwtPayload } from 'jsonwebtoken'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import mongoose, { SortOrder, Types } from 'mongoose'
import { paginationHelpers } from '../../helpers/pagination'
import {
  IFilterOptions,
  IGenericResponse,
  IPaginationOptions,
} from '../../shared/interfaces/common.interface'
import { queryFieldsManipulation } from '../../helpers/queryFieldsManipulation'
import ShopModel from '../shop/shop.model'
import { getTotals } from './service.utils'

const createService = async (
  loggedUser: JwtPayload,
  servicePayload: IService,
): Promise<IService> => {
  if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
    const standardizedServiceName = servicePayload.name.toLowerCase()

    // check if the seller has shop or not
    const shop = await ShopModel.findOne({ seller: loggedUser.userId })

    console.log('shop', shop)
    console.log('logged user', loggedUser)
    // Check if a service with a case-insensitive name already exists
    const existingService = await ServiceModel.findOne({
      name: { $regex: new RegExp('^' + standardizedServiceName + '$', 'i') },
    })

    if (existingService) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Service already created with the name',
      )
    }

    const createdService = await ServiceModel.create({
      ...servicePayload,
      shop: shop?._id,
      seller: loggedUser.userId,
    })
    return createdService
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not a seller')
  }
}

const getService = async (
  serviceId: mongoose.Types.ObjectId,
): Promise<IService> => {
  const service = await ServiceModel.findById({ _id: serviceId }).populate(
    'shop',
  )

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }

  return service
}
const updateService = async (
  loggedUser: JwtPayload,
  serviceId: mongoose.Types.ObjectId,
  updatePayload: object,
): Promise<IService | null> => {
  console.log('updatePayload', updatePayload)
  const queryPayload = {
    _id: serviceId,
  } as {
    _id: mongoose.Types.ObjectId
    seller: mongoose.Types.ObjectId
  }
  if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
    queryPayload.seller = loggedUser.userId
  }
  const service = await ServiceModel.findOne(queryPayload)

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }
  const updateService = await ServiceModel.findByIdAndUpdate(
    { _id: serviceId },
    { ...updatePayload },
    { new: true },
  )

  return updateService
}

const deleteService = async (
  loggedUser: JwtPayload,
  serviceId: mongoose.Types.ObjectId,
): Promise<void> => {
  const queryPayload: {
    _id: mongoose.Types.ObjectId
    seller?: mongoose.Types.ObjectId
  } = {
    _id: serviceId,
  }

  if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
    queryPayload.seller = loggedUser.userId
  }

  const service = await ServiceModel.findOneAndDelete(queryPayload)

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }
}

const getAllServices = async (
  loggedUser: JwtPayload,
  queryOptions: IPaginationOptions,
  filterOptions: IFilterOptions,
): Promise<IGenericResponse<IService[]>> => {
  let queryPayload = { seller: loggedUser.userId } as any
  if (
    loggedUser.role === ENUM_USER_ROLE.ADMIN ||
    loggedUser.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    queryPayload = {}
  }
  const { searchTerm, ...filterableFields } = filterOptions
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(queryOptions)

  const sortCondition: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }

  const queriesWithFilterableFields = queryFieldsManipulation(
    searchTerm,
    ['name', 'category', 'subCategory', 'status'],
    filterableFields,
  )

  if (queriesWithFilterableFields.length > 0) {
    queryPayload.$and = queriesWithFilterableFields
  }

  console.log('filterOptions', filterOptions)

  const services = await ServiceModel.find(queryPayload)
    .populate('shop', 'shopName')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
  const totals = await getTotals(
    ServiceModel as any,
    { seller: new Types.ObjectId(loggedUser.userId) },
    ['APPROVED', 'PENDING', 'REJECTED'],
  )

  return {
    meta: {
      page,
      limit,
      total: totals?.total,
      totalApproved: totals['APPROVED'],
      totalPending: totals['PENDING'],
      totalRejected: totals['REJECTED'],
    },
    data: services,
  }
}
const getTopServices = async (
  queryOptions: IPaginationOptions,
): Promise<IGenericResponse<IService[]>> => {
  const { page, limit } = paginationHelpers.calculatePagination(queryOptions)
  const services = await ServiceModel.find({
    status: ServiceStatusList.APPROVED,
  })
    .sort({ updatedAt: -1 })
    .populate('shop', 'shopName serviceTime')
    .limit(limit)
  const totals = await getTotals(ServiceModel as any, {}, [
    'PENDING',
    'APPROVED',
    'REJECTED',
  ])

  return {
    meta: {
      page,
      limit,
      total: totals?.total,
    },
    data: services,
  }
}

export const SaloonService = {
  createService,
  getService,
  updateService,
  deleteService,
  getAllServices,
  getTopServices,
}
