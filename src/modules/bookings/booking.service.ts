/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
// import moment from 'moment'
import ApiError from '../../errors/ApiError'
import { DayOfWeeks, IBooking } from './booking.interface'
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
import { bookingsAggregationPipeline } from './booking.utils'
import ShopModel from '../shop/shop.model'
import { IShopDocument } from '../shop/shop.interface'
import { ShopTimeSlotsServices } from '../shop_timeslots/shop_timeslots.service'
import moment from 'moment'
import Transaction from '../transactions/transactions.model'
import {
  AmountStatus,
  PaymentMethod,
  TransactionType,
} from '../transactions/transactions.interface'

interface IBookingPayload {
  serviceDate: string
  serviceStartTime: string
  processingFees: number
  totalAmount: number
  serviceId: string
  sellerId: string
  shop: any
  stripePaymentIntentId: string
  paymentMethod: PaymentMethod
}

const createBooking = async (
  loggedUser: JwtPayload,
  bookingPayload: IBookingPayload,
): Promise<any> => {
  console.log('bookingPayload', bookingPayload)
  if (loggedUser.role !== ENUM_USER_ROLE.CUSTOMER) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not a customer')
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const shop = (await ShopModel.findOne({
      _id: bookingPayload.shop?._id,
    }).session(session)) as IShopDocument

    if (!shop) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found')
    }

    const dayOfWeek = moment(bookingPayload.serviceDate).format(
      'dddd',
    ) as DayOfWeeks

    if (shop?.serviceTime.offDays.includes(dayOfWeek)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `The shop is closed on ${dayOfWeek}`,
      )
    }

    const shopTimeSlot = await ShopTimeSlotsServices.createShopTimeSlots(
      {
        shop: bookingPayload.shop,
        seller: new mongoose.Types.ObjectId(bookingPayload.sellerId),
        serviceDate: bookingPayload.serviceDate,
        startTime: bookingPayload.serviceStartTime,
      },
      session,
    )

    const booking = await BookingModel.create(
      [
        {
          customer: loggedUser.userId,
          seller: new mongoose.Types.ObjectId(bookingPayload.sellerId),
          shop: bookingPayload.shop._id,
          serviceId: new mongoose.Types.ObjectId(bookingPayload.serviceId),
          serviceStartTime: bookingPayload.serviceStartTime,
          shopTimeSlot: shopTimeSlot?._id,
          totalAmount: bookingPayload.totalAmount,
          processingFees: bookingPayload.processingFees,
        },
      ],
      { session },
    )

    await Transaction.create(
      [
        {
          customer: loggedUser.userId,
          seller: new mongoose.Types.ObjectId(bookingPayload.sellerId),
          service: new mongoose.Types.ObjectId(bookingPayload.serviceId),
          booking: booking[0]._id,
          amount: bookingPayload.totalAmount,
          stripeProcessingFee: bookingPayload.processingFees,
          paymentMethod: bookingPayload.paymentMethod,
          stripePaymentIntentId: bookingPayload.stripePaymentIntentId,
          transactionType: TransactionType.PAYMENT,
          status: AmountStatus.PENDING,
        },
      ],
      { session },
    )

    await session.commitTransaction()
    return booking[0]
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
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
