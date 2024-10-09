import mongoose, { Schema } from 'mongoose'
import { IShopTimeSlots } from './shop_timeslots.interface'

// Create the Mongoose Schema
const ShopTimeSlotsSchema = new mongoose.Schema<IShopTimeSlots>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'shop',
      required: true,
    },
    slotFor: {
      type: Date,
      required: true,
    },
    timeSlots: {
      type: [
        {
          startTime: String,
          maxResourcePerHour: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
)

// Create the Mongoose Model
const ShopTimeSlotsModel = mongoose.model<IShopTimeSlots>(
  'shopTimeSlot',
  ShopTimeSlotsSchema,
)

export default ShopTimeSlotsModel
