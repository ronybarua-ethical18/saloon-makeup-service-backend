import httpStatus from 'http-status'
import ApiError from '../../errors/ApiError'
import { IService } from './service.interface'
import { ServiceModel } from './service.model'
import { JwtPayload } from 'jsonwebtoken'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import mongoose from 'mongoose'

const createService = async (
  loggedUser: JwtPayload,
  servicePayload: IService,
): Promise<IService> => {
  if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
    const standardizedServiceName = servicePayload.name.toLowerCase()

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
  const service = await ServiceModel.findById({ _id: serviceId })

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

const getAllServices = async (loggedUser: JwtPayload): Promise<IService[]> => {
  let queryPayload = { seller: loggedUser.userId } as object
  if (
    loggedUser.role === ENUM_USER_ROLE.ADMIN ||
    loggedUser.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    queryPayload = {}
  }

  const services = await ServiceModel.find(queryPayload)
  return services
}

export const SaloonService = {
  createService,
  getService,
  updateService,
  deleteService,
  getAllServices,
}
