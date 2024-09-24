import mongoose, { Document } from 'mongoose'
import { DayOfWeeks } from '../bookings/booking.interface'

interface IServiceTime {
  openingHour: string
  closingHour: string
  offDays: DayOfWeeks[]
}

type IGalleryImages = {
  img: string
}

// Interface for the shop document
export interface IShopDocument extends Document {
  shopName: string
  shopDescription: string
  location: string
  seller: mongoose.Types.ObjectId
  serviceTime: IServiceTime
  gallery: IGalleryImages[]
  maxResourcePerHour: number
}
