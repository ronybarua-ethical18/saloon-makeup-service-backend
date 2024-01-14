import mongoose, { Document } from 'mongoose'

// Interface for the shop document
export interface IShopDocument extends Document {
  shopName: string
  shopDescription: string
  location: string
  seller: mongoose.Types.ObjectId
  openingHours: { weekday: string; startTime: string; endTime: string }[]
  gallery: string[]
}
