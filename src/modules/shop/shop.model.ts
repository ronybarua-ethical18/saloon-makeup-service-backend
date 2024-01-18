import mongoose, { Schema } from 'mongoose'
import { IShopDocument } from './shop.interface'
import { DayOfWeeks } from '../bookings/booking.interface'

const shopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    shopDescription: { type: String, required: true },
    location: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    serviceTime: {
      openingHour: {
        type: String,
        required: true,
      },
      closingHour: {
        type: String,
        required: true,
      },
      offDays: [{ type: String, enum: DayOfWeeks }],
    },
    gallery: [{ type: String }],
  },
  { timestamps: true },
)

// Create and export the mongoose model
const ShopModel = mongoose.model<IShopDocument>('shop', shopSchema)

export default ShopModel
