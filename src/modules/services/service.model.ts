import mongoose, { Schema } from 'mongoose'
import {
  IServiceDocument,
  IServiceModel,
  ServiceStatusList,
} from './service.interface'
import { CATEGORIES, SUB_CATEGORIES } from '../../shared/enums/service.enum'

const serviceSchema = new mongoose.Schema<IServiceDocument, IServiceModel>(
  {
    name: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    subCategory: {
      type: String,
      enum: SUB_CATEGORIES,
      required: true,
    },
    price: { type: Number, required: true },
    images: [{ img: { type: String, required: true } }],
    description: { type: String, required: true },
    availability: { type: Boolean, default: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'shop', required: true },
    status: {
      type: String,
      enum: ServiceStatusList,
      default: ServiceStatusList.PENDING,
    },
    reviews: [
      {
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes
serviceSchema.index({ name: 1 })
serviceSchema.index({ category: 1 })
serviceSchema.index({ subCategory: 1 })
serviceSchema.index({ status: 1 })

// Custom method example in the IServiceModel interface
serviceSchema.statics.findByName = async function (
  name: string,
): Promise<IServiceDocument | null> {
  return this.findOne({ name }).exec()
}

export const ServiceModel = mongoose.model<IServiceDocument, IServiceModel>(
  'service',
  serviceSchema,
)
