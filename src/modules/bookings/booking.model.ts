import mongoose, { Schema } from 'mongoose'
import { BookingStatusList, DayOfWeeks, IBooking } from './booking.interface'

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'shop', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'service', required: true },
    serviceStartTime: { type: String, required: true },
    serviceEndTime: { type: String, required: true },
    serviceDayOfWeek: { type: String, enum: DayOfWeeks, required: true },
    status: {
      type: String,
      enum: BookingStatusList,
      default: BookingStatusList.PENDING,
    },
  },
  { timestamps: true },
)

// Create and export the mongoose model
const BookingModel = mongoose.model<IBooking>('booking', bookingSchema)

export default BookingModel
