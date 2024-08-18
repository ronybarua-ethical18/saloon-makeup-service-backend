import { JwtPayload } from 'jsonwebtoken'
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
  LoggedUser: JwtPayload,
  payload: {
    shop: mongoose.Types.ObjectId
    startTime: string
  },
): Promise<void> => {
  const seller = await UserModel.findOne({
    _id: LoggedUser.userId,
    role: 'seller',
  })

  const shop = await ShopModel.findOne({ _id: payload?.shop })

  if (seller && shop) {
    const todayStart = moment().startOf('day').toDate()
    const todayEnd = moment().endOf('day').toDate()

    // Find time slots for the shop where createdAt is within today
    const shopTimeSlot = await ShopTimeSlotsModel.findOne({
      shop: shop._id,
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    })
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

      await ShopTimeSlotsModel.findOneAndUpdate(
        { shop: shop._id, _id: shopTimeSlot._id },
        {
          timeSlots: updatedTimeSlots,
        },
        { new: true },
      )
    } else {
      const shopOpenHour = shop.serviceTime.openingHour
      const shopClosingHour = shop.serviceTime.closingHour

      const generatedTimeSlots = generateTimeSlots(
        shopOpenHour,
        shopClosingHour,
        5,
      )

      await ShopTimeSlotsModel.create({
        shop: shop._id,
        timeSlots: generatedTimeSlots,
      })
    }
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to perform the operation',
    )
  }
}

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
