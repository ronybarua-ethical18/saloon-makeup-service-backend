// /* eslint-disable @typescript-eslint/no-explicit-any */
// import httpStatus from 'http-status'
// import ApiError from '../../errors/ApiError'
// import { BookingStatusList, IBooking, IService } from './booking.interface'
// import BookingModel, { ServiceModel } from './booking.model'
// import { JwtPayload } from 'jsonwebtoken'
// import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
// import mongoose, { SortOrder } from 'mongoose'
// import { paginationHelpers } from '../../helpers/pagination'
// import {
//   IFilterOptions,
//   IGenericResponse,
//   IPaginationOptions,
// } from '../../shared/interfaces/common.interface'
// import { queryFieldsManipulation } from '../../helpers/queryFieldsManipulation'

// const createBooking = async (
//   loggedUser: JwtPayload,
//   bookingPayload: IBooking,
// ): Promise<IBooking> => {
//   if (loggedUser.role === ENUM_USER_ROLE.CUSTOMER) {
//     const serviceMatch = await BookingModel.findOne({
//       serviceId: bookingPayload.serviceId,
//       seller: bookingPayload.seller,
//       appointMentDateTime: bookingPayload.appointMentDateTime,
//       status: BookingStatusList.PENDING,
//     })

//     if(serviceMatch){
//       throw new ApiError(httpStatus.CONFLICT, 'The service is not available with the time frame')
//     }
//   } else {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'You are not a customer')
//   }
// }

// const getService = async (
//   serviceId: mongoose.Types.ObjectId,
// ): Promise<IService> => {
//   const service = await ServiceModel.findById({ _id: serviceId })

//   if (!service) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
//   }

//   return service
// }
// const updateService = async (
//   loggedUser: JwtPayload,
//   serviceId: mongoose.Types.ObjectId,
//   updatePayload: object,
// ): Promise<IService | null> => {
//   const queryPayload = {
//     _id: serviceId,
//   } as {
//     _id: mongoose.Types.ObjectId
//     seller: mongoose.Types.ObjectId
//   }
//   if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
//     queryPayload.seller = loggedUser.userId
//   }
//   const service = await ServiceModel.findOne(queryPayload)

//   if (!service) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
//   }
//   const updateService = await ServiceModel.findByIdAndUpdate(
//     { _id: serviceId },
//     { ...updatePayload },
//     { new: true },
//   )

//   return updateService
// }

// const deleteService = async (
//   loggedUser: JwtPayload,
//   serviceId: mongoose.Types.ObjectId,
// ): Promise<void> => {
//   const queryPayload: {
//     _id: mongoose.Types.ObjectId
//     seller?: mongoose.Types.ObjectId
//   } = {
//     _id: serviceId,
//   }

//   if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
//     queryPayload.seller = loggedUser.userId
//   }

//   const service = await ServiceModel.findOneAndDelete(queryPayload)

//   if (!service) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
//   }
// }

// const getAllServices = async (
//   loggedUser: JwtPayload,
//   queryOptions: IPaginationOptions,
//   filterOptions: IFilterOptions,
// ): Promise<IGenericResponse<IService[]>> => {
//   let queryPayload = { seller: loggedUser.userId } as any
//   if (
//     loggedUser.role === ENUM_USER_ROLE.ADMIN ||
//     loggedUser.role === ENUM_USER_ROLE.SUPER_ADMIN
//   ) {
//     queryPayload = {}
//   }
//   const { searchTerm, ...filterableFields } = filterOptions
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(queryOptions)

//   const sortCondition: { [key: string]: SortOrder } = {}

//   if (sortBy && sortOrder) {
//     sortCondition[sortBy] = sortOrder
//   }

//   const queriesWithFilterableFields = queryFieldsManipulation(
//     searchTerm,
//     filterableFields,
//   )

//   if (queriesWithFilterableFields.length) {
//     queryPayload.$and = queriesWithFilterableFields
//   }

//   const services = await ServiceModel.find(queryPayload)
//     .sort(sortCondition)
//     .skip(skip)
//     .limit(limit)

//   const total = await ServiceModel.countDocuments()
//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: services,
//   }
// }

// export const SaloonService = {
//   createService,
//   getService,
//   updateService,
//   deleteService,
//   getAllServices,
// }
