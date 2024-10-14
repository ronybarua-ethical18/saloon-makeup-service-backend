import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import mongoose from 'mongoose'
import { IBooking } from './booking.interface'
import pick from '../../shared/pick'
import { paginationFields } from '../../constants/pagination'
import { filterableFields } from './booking.constants'
import { BookingService } from './booking.service'
import { addJobToPaymentDispatchQueue } from '../../queues/payment/paymentQueue'

const createBooking = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const result = await BookingService.createBooking(loggedUser, req.body)

  sendResponse<IBooking>(res, {
    statusCode: 200,
    success: true,
    message: 'New Booking is created successfully',
    data: result,
  })
})

const getAllBookings = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const filterOptions = pick(req.query, filterableFields)
  const queryOptions = pick(req.query, paginationFields)
  const result = await BookingService.getAllBookings(
    loggedUser,
    queryOptions,
    filterOptions,
  )

  sendResponse<IBooking[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All bookings fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getBooking = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.bookingId === 'string') {
    const result = await BookingService.getBooking(
      new mongoose.Types.ObjectId(req.params['bookingId']),
    )

    sendResponse<IBooking>(res, {
      statusCode: 200,
      success: true,
      message: 'Single booking fetched successfully',
      data: result,
    })
  }
})

const updateBooking = tryCatchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.updateBooking(
      new mongoose.Types.ObjectId(req.params['bookingId']),
      req.body,
    )

    sendResponse<IBooking>(res, {
      statusCode: 200,
      success: true,
      message: 'Booking updated successfully',
      data: result,
    })
})

const updateBookings = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }

  const bookings = [
    {
      _id: '66ffa177c96d4be80a8024f2',
      serviceStartTime: '2:00PM',
      status: 'BOOKED',
    },
    {
      _id: '66ffa34b662c89a45d909e51',
      serviceStartTime: '11:00AM',
      status: 'BOOKED',
    },
    {
      _id: '66ffa4eb7cd68b5cd362c377',
      serviceStartTime: '9:00AM',
      status: 'BOOKED',
    },
    {
      _id: '66ffa5e77cd68b5cd362c3be',
      serviceStartTime: '9:00AM',
      status: 'COMPLETED',
    },
    {
      _id: '66ffa6477cd68b5cd362c3d8',
      serviceStartTime: '10:00AM',
      status: 'COMPLETED',
    },
  ]

  console.log("bookings", bookings)

  const filteredBookings = await Promise.all(
    bookings.map(async (booking) => {
      const processedBooking = await BookingService.verifyBooking(
        loggedUser,
        new mongoose.Types.ObjectId(booking?._id)
      );
      return processedBooking; // Return the processed booking
    })
  ).then((results) => results.filter((booking) => booking)); 

  console.log('filtered bookings', filteredBookings)

  if (filteredBookings.length > 0) {
    for (const booking of filteredBookings) {
      addJobToPaymentDispatchQueue(booking).then(() =>
        console.log('Job added to payment dispatch queue'),
      )
    }
    return sendResponse<IBooking>(res, {
      statusCode: 200,
      success: true,
      message:
        'Bookings are being updated, and the corresponding payment disbursement is in progress.',
    })
  } else {
    return sendResponse<IBooking>(res, {
      statusCode: 200,
      success: true,
      message: 'No valid booking records found',
    })
  }
})

const deleteBooking = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.bookingId === 'string') {
    await BookingService.deleteBooking(
      new mongoose.Types.ObjectId(req.params['bookingId']),
    )

    sendResponse<IBooking>(res, {
      statusCode: 200,
      success: true,
      message: 'Booking deleted successfully',
    })
  }
})

export const BookingController = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  updateBookings
}
