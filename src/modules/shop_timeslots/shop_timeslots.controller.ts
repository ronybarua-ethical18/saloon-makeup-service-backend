import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import mongoose from 'mongoose'
import { ShopTimeSlotsServices } from './shop_timeslots.service'

const createShopTimeSlots = tryCatchAsync(
  async (req: Request, res: Response) => {
    await ShopTimeSlotsServices.createShopTimeSlots(req.body)

    sendResponse<{ url: string }>(res, {
      statusCode: 200,
      success: true,
      message: 'Shop time slots are created successfully',
    })
  },
)

const getSingleShopTimeSlots = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { shopId } = req.params
    const { date } = req.query
    const result = await ShopTimeSlotsServices.getSingleShopTimeSlots(
      new mongoose.Types.ObjectId(shopId as string),
      date as string,
    )

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Shop time slots retrieved successfully',
      data: result,
    })
  },
)

export const ShopTimeSlotsController = {
  createShopTimeSlots,
  getSingleShopTimeSlots,
}
