/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
// import moment from 'moment'

import ApiError from '../../errors/ApiError'
import {
  BookingStatusList,
  DayOfWeeks,
  IBooking,
  IPaymentDisbursedEssentials,
  PopulatedBooking,
} from './booking.interface'
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
  bookingsAggregationPipeline,
  generateId,
  isServiceDateTimeAtLeastOneHourInPast,
} from './booking.utils'
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
import { getTotals } from '../services/service.utils'
import { queryFieldsManipulation } from '../../helpers/queryFieldsManipulation'
import { SentryCaptureMessage, SentrySetContext } from '../../config/sentry'
import { toFixConverter } from '../../utils/toFixConverter'

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

    const totalAmount = bookingPayload.totalAmount
    const bookingId = generateId('SVBA', totalAmount)
    const applicationFeeAmount = toFixConverter(totalAmount * 0.1) // 10% fee for the platform owner
    const sellerAmount = toFixConverter(totalAmount - applicationFeeAmount)

    const booking = await BookingModel.create(
      [
        {
          bookingId,
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
    const transactionId = generateId('SVTA', bookingPayload?.totalAmount)

    await Transaction.create(
      [
        {
          transactionId,
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
          applicationFee: applicationFeeAmount,
          sellerAmount: sellerAmount,
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
  bookingId: mongoose.Types.ObjectId,
  updatePayload: object,
): Promise<IBooking | null> => {
  console.log('update booking payload from queue', updatePayload)
  const updateBooking = await BookingModel.findByIdAndUpdate(
    { _id: bookingId },
    { ...updatePayload },
    { new: true },
  )

  return updateBooking
}
const verifyBooking = async (
  loggedUser: JwtPayload,
  bookingId: mongoose.Types.ObjectId,
): Promise<IPaymentDisbursedEssentials  | null> => {
  // Check if the logged user is a seller
  if (loggedUser.role !== 'seller') {
    SentrySetContext('Forbidden', {
      issue: 'Operation not allowed - User is not a seller',
    })
    SentryCaptureMessage('Unauthorized booking verification attempt')
    return null
  }

  // Find the booking with necessary relationships
  const findBooking = await BookingModel.findOne({
    seller: loggedUser.userId,
    _id: bookingId,
    status: BookingStatusList.BOOKED,
  })
    .populate<PopulatedBooking>([
      { path: 'shopTimeSlot', select: 'slotFor' },
      { path: 'seller', select: 'firstName lastName email phone' },
      { path: 'customer', select: 'firstName lastName email phone' },
      { path: 'serviceId', select: 'name' },
      { path: 'shop', select: 'shopName' },
    ])
    .lean()

  // Return early if booking not found
  if (!findBooking) {
    SentrySetContext('Booking not found', {
      seller: loggedUser.userId,
      bookingId,
    })
    SentryCaptureMessage('Booking not found for verification')
    return null
  }

  // Validate if the booking is eligible for update based on service time
  const { slotFor: serviceDate } = findBooking.shopTimeSlot as any
  const serviceTime = findBooking.serviceStartTime

  const isBookingEligible = isServiceDateTimeAtLeastOneHourInPast(
    serviceDate,
    serviceTime,
  )

  if (!isBookingEligible) {
    SentrySetContext('Booking update not eligible for time slot', {
      seller: loggedUser.userId,
      bookingId,
    })
    SentryCaptureMessage(
      'Booking is not eligible for update due to invalid service time',
    )
    return null
  }

  // Find the pending transaction for the booking
  const pendingTransaction = await Transaction.findOne({
    booking: bookingId,
    status: AmountStatus.PENDING,
  })

  // Return early if no pending transaction is found
  if (!pendingTransaction) {
    SentrySetContext('Transaction not found for booking', {
      seller: loggedUser.userId,
      bookingId,
    })
    SentryCaptureMessage('Pending transaction not found for the booking')
    return null
  }

  const seller = findBooking?.seller || {}
  const customer = findBooking?.customer || {}

  // Return the required payment disbursement details
  return {
    bookingId,
    paymentIntentId: pendingTransaction.stripePaymentIntentId,
    customerBookingId:findBooking.bookingId,
    sellerId: seller._id,
    customerId: customer._id,
    serviceName:findBooking.serviceId.name,
    sellerName: `${seller?.firstName} ${seller.lastName}`,
    sellerEmail: seller.email,
    customerName: `${customer.firstName} ${customer.lastName}`,
    customerEmail: customer.email,
    shopName: findBooking.shop.shopName,
    totalAmount: findBooking.totalAmount,
  }
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
  const { searchTerm, ...filterableFields } = filterOptions as any
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(queryOptions)

  const sortCondition: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }

  const queriesWithFilterableFields = queryFieldsManipulation(
    searchTerm,
    ['status'],
    filterableFields,
  )

  if (queriesWithFilterableFields.length > 0) {
    queryPayload.$and = queriesWithFilterableFields
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
      .populate([
        { path: 'customer', select: 'firstName lastName phone' },
        { path: 'seller', select: 'firstName lastName phone' },
        { path: 'serviceId', select: 'name category subCategory price' },
        {
          path: 'shop',
          select: 'shopName location maxResourcePerHour serviceTime',
        },
        { path: 'shopTimeSlot', select: 'slotFor' },
      ])
      .lean()
  }

  const totals = await getTotals(
    BookingModel as any,
    { seller: new mongoose.Types.ObjectId(loggedUser.userId) },
    ['BOOKED', 'CANCELLED', 'COMPLETED'],
  )

  console.log('totals', totals)

  return {
    meta: {
      page,
      limit,
      total: totals?.total,
      totalBooked: totals['BOOKED'],
      totalCompleted: totals['COMPLETED'],
      totalCancelled: totals['CANCELLED'],
    },
    data: bookings,
  }
}

export const BookingService = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  verifyBooking,
}
