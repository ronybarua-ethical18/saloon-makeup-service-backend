import { UserModel } from '../user/user.model'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'
import { IShopTimeSlots, ITimeSlot } from './shop_timeslots.interface'
import ShopModel from '../shop/shop.model'
import ShopTimeSlotsModel from './shop_timeslots.model'
import moment from 'moment'
import { generateTimeSlots } from './shop_timeslots.utils'
import mongoose from 'mongoose'

const createShopTimeSlots = async (
  payload: {
    shop: mongoose.Types.ObjectId
    seller: mongoose.Types.ObjectId
    serviceDate: string
    startTime: string
  },
  session?: mongoose.ClientSession,
): Promise<IShopTimeSlots | null> => {
  const seller = await UserModel.findOne({
    _id: payload.seller,
    role: 'seller',
  }).session(session || null)

  const shop = await ShopModel.findOne({ _id: payload?.shop }).session(
    session || null,
  )

  if (seller && shop) {
    const serviceDateStart = moment(payload.serviceDate).startOf('day').toDate()
    const serviceDateEnd = moment(payload.serviceDate).endOf('day').toDate()

    // Find time slots for the shop where createdAt is within the service date
    const shopTimeSlot = await ShopTimeSlotsModel.findOne({
      shop: shop._id,
      slotFor: {
        $gte: serviceDateStart,
        $lte: serviceDateEnd,
      },
    }).session(session || null)

    if (shopTimeSlot) {
      const updatedTimeSlots = shopTimeSlot.timeSlots.map(
        (timeSlot: ITimeSlot) => {
          if (
            payload?.startTime === timeSlot.startTime &&
            timeSlot.maxResourcePerHour > 0
          ) {
            return {
              startTime: timeSlot.startTime,
              maxResourcePerHour: timeSlot.maxResourcePerHour - 1,
            }
          }
          return timeSlot
        },
      )

      const updatedShopTimeSlot = await ShopTimeSlotsModel.findOneAndUpdate(
        { shop: shop._id, _id: shopTimeSlot._id },
        {
          timeSlots: updatedTimeSlots,
        },
        { new: true, session },
      )

      return updatedShopTimeSlot
    } else {
      const shopOpenHour = shop.serviceTime.openingHour
      const shopClosingHour = shop.serviceTime.closingHour

      // Generate the time slots
      let generatedTimeSlots = generateTimeSlots(
        shopOpenHour,
        shopClosingHour,
        shop?.maxResourcePerHour || 5,
      )

      // Reduce maxResourcePerHour for the specified startTime
      generatedTimeSlots = generatedTimeSlots.map(timeSlot => {
        if (
          timeSlot.startTime === payload.startTime &&
          timeSlot.maxResourcePerHour > 0
        ) {
          return {
            startTime: timeSlot.startTime,
            maxResourcePerHour: timeSlot.maxResourcePerHour - 1,
          }
        }
        return timeSlot
      })

      const newShopTimeSlot = await ShopTimeSlotsModel.create(
        [
          {
            shop: shop._id,
            slotFor: new Date(payload.serviceDate),
            timeSlots: generatedTimeSlots,
          },
        ],
        { session },
      )

      return newShopTimeSlot[0]
    }
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to perform the operation',
    )
  }
}

export default createShopTimeSlots

const getSingleShopTimeSlots = async (
  shopId: mongoose.Types.ObjectId,
  currentDate: string,
): Promise<IShopTimeSlots | null> => {
  const startOfDay = moment(currentDate).startOf('day').toDate()
  const endOfDay = moment(currentDate).endOf('day').toDate()

  const timeSlot = await ShopTimeSlotsModel.findOne({
    shop: shopId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })

  return timeSlot || null
}

export const ShopTimeSlotsServices = {
  createShopTimeSlots,
  getSingleShopTimeSlots,
}
