import mongoose, { Schema } from 'mongoose'
import { IShopDocument } from './shop.interface'

const shopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    shopDescription: { type: String, required: true },
    location: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    openingHours: [{ type: Object }],
    gallery: [{ type: String }],
  },
  { timestamps: true },
)

// Create and export the mongoose model
const ShopModel = mongoose.model<IShopDocument>('Shop', shopSchema)

export default ShopModel
