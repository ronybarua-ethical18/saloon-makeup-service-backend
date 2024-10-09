import mongoose, { Schema } from 'mongoose'
import { IShopDocument } from './shop.interface'
import { DayOfWeeks } from '../bookings/booking.interface'

const GallerySchema = new mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
})

const ShopSchema = new mongoose.Schema(
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
    gallery: {
      type: [GallerySchema], // Define gallery as an array of embedded documents
      required: true,
    },
    maxResourcePerHour: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

// Create and export the mongoose model
const ShopModel = mongoose.model<IShopDocument>('shop', ShopSchema)

export default ShopModel
