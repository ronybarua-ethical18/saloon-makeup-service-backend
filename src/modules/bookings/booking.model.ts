import mongoose, { Schema } from 'mongoose'
import { BookingStatusList, IBooking } from './booking.interface'

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    bookingId: {
      type: String,
      requried: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    customer: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'shop', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'service', required: true },
    serviceStartTime: { type: String, required: true },
    shopTimeSlot: {
      type: Schema.Types.ObjectId,
      ref: 'shopTimeSlot',
      required: true,
    },
    status: {
      type: String,
      enum: BookingStatusList,
      default: BookingStatusList.BOOKED,
    },
  },
  { timestamps: true },
)

// Pre-save hook to format all number fields
bookingSchema.pre('save', function (next) {
  const booking = this as IBooking

  // Format the number fields with two decimal places
  booking.totalAmount = Math.round(booking.totalAmount * 100) / 100

  next()
})

// Create and export the mongoose model
const BookingModel = mongoose.model<IBooking>('booking', bookingSchema)

export default BookingModel
