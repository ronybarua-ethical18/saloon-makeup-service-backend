import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import mongoose from 'mongoose'
import { SaloonService } from './booking.service'
import { IBooking } from './booking.interface'
import pick from '../../shared/pick'
import { paginationFields } from '../../constants/pagination'
import { filterableFields } from './booking.constants'

const createBooking = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const result = await SaloonService.createBooking(loggedUser, req.body)

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
  const result = await SaloonService.getAllBookings(
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
    const result = await SaloonService.getBooking(
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
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  if (typeof req.params.bookingId === 'string') {
    const result = await SaloonService.updateBooking(
      loggedUser,
      new mongoose.Types.ObjectId(req.params['bookingId']),
      req.body,
    )

    sendResponse<IBooking>(res, {
      statusCode: 200,
      success: true,
      message: 'Booking updated successfully',
      data: result,
    })
  }
})

const deleteBooking = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.bookingId === 'string') {
    await SaloonService.deleteBooking(
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
}
