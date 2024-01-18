/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import moment from 'moment'
import ApiError from '../../errors/ApiError'
import { IBooking } from './booking.interface'
import BookingModel from './booking.model'
import { JwtPayload } from 'jsonwebtoken'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import mongoose, { SortOrder } from 'mongoose'
import { paginationHelpers } from '../../helpers/pagination'
import {
  IFilterOptions,
  IGenericResponse,
  IPaginationOptions,
} from '../../shared/interfaces/common.interface'
import {
  areBothTimesInBetween,
  bookingsAggregationPipeline,
} from './booking.utils'
import ShopModel from '../shop/shop.model'
import { IShopDocument } from '../shop/shop.interface'

const createBooking = async (
  loggedUser: JwtPayload,
  bookingPayload: IBooking,
): Promise<any> => {
  if (loggedUser.role === ENUM_USER_ROLE.CUSTOMER) {
    const shop = (await ShopModel.findOne({
      _id: bookingPayload.shop,
    })) as IShopDocument

    if (shop?.serviceTime.offDays.includes(bookingPayload.serviceDayOfWeek)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `The shop is closed on ${bookingPayload.serviceDayOfWeek}`,
      )
    }

    if (
      !areBothTimesInBetween(
        bookingPayload.serviceStartTime,
        bookingPayload.serviceEndTime,
        shop?.serviceTime?.openingHour,
        shop?.serviceTime?.closingHour,
      )
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'The shop does not offer any services during this time slot.',
      )
    }

    const alreadyBookedServiceOnDay = await BookingModel.find({
      serviceId: bookingPayload.serviceId,
      seller: bookingPayload.seller,
      shop: bookingPayload.shop,
      serviceDayOfWeek: bookingPayload.serviceDayOfWeek,
    })

    const existingBookingSlots = alreadyBookedServiceOnDay?.map(booking => {
      return {
        serviceStartTime: booking.serviceStartTime,
        serviceEndTime: booking.serviceEndTime,
        serviceDayOfWeek: booking.serviceDayOfWeek,
      }
    })

    for (const slot of existingBookingSlots) {
      const existingBookingSlotStartTime = moment(
        slot.serviceStartTime,
        'HH:mm',
      )
      const existingBookingSlotEndTime = moment(slot.serviceEndTime, 'HH:mm')
      const newBookingSlotStartTime = moment(
        bookingPayload.serviceStartTime,
        'HH:mm',
      )
      const newBookingSlotEndTime = moment(
        bookingPayload.serviceEndTime,
        'HH:mm',
      )

      if (
        newBookingSlotStartTime <= existingBookingSlotEndTime &&
        newBookingSlotEndTime >= existingBookingSlotStartTime
      ) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'The service has already been booked for the requested time slot.',
        )
      }
    }

    const booking = await BookingModel.create({
      ...bookingPayload,
      customer: loggedUser.userId,
    })

    return booking
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not a customer')
  }
}

const getBooking = async (
  bookingId: mongoose.Types.ObjectId,
): Promise<IBooking> => {
  const booking = await BookingModel.findById({ _id: bookingId })

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
  }

  return booking
}
const updateBooking = async (
  loggedUser: JwtPayload,
  bookingId: mongoose.Types.ObjectId,
  updatePayload: object,
): Promise<IBooking | null> => {
  let query

  if (loggedUser.role === 'admin' || loggedUser.role === 'super_admin') {
    query = { _id: bookingId }
  } else {
    query = {
      $or: [
        { _id: bookingId, customer: loggedUser.userId },
        { _id: bookingId, seller: loggedUser.userId },
      ],
    }
  }

  const booking = await BookingModel.findOne(query)

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
  }
  const updateBooking = await BookingModel.findByIdAndUpdate(
    { _id: bookingId },
    { ...updatePayload },
    { new: true },
  )

  return updateBooking
}

const deleteBooking = async (
  bookingId: mongoose.Types.ObjectId,
): Promise<void> => {
  const booking = await BookingModel.findOneAndDelete({ _id: bookingId })

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found')
  }
}

const getAllBookings = async (
  loggedUser: JwtPayload,
  queryOptions: IPaginationOptions,
  filterOptions: IFilterOptions,
): Promise<IGenericResponse<IBooking[]>> => {
  let queryPayload = {
    $or: [{ seller: loggedUser.userId }, { customer: loggedUser.userId }],
  } as any
  if (
    loggedUser.role === ENUM_USER_ROLE.ADMIN ||
    loggedUser.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    queryPayload = {}
  }
  const { searchTerm } = filterOptions as any
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(queryOptions)

  const sortCondition: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }

  let bookings

  if (searchTerm) {
    const nameRegex: RegExp = new RegExp(searchTerm, 'i')

    bookings = await BookingModel.aggregate(
      bookingsAggregationPipeline(nameRegex),
    )
  } else {
    bookings = await BookingModel.find(queryPayload)
      .sort(sortCondition)
      .limit(limit)
      .skip(skip)
      .populate('customer')
      .populate('seller')
      .populate('serviceId')
      .populate('shop')
  }

  const total = await BookingModel.countDocuments()

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: bookings,
  }
}

export const SaloonService = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
}
