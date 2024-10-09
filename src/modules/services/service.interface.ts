import mongoose, { Document, Model } from 'mongoose'
import { CATEGORIES, SUB_CATEGORIES } from '../../shared/enums/service.enum'
type Images = {
  img: string
}

interface IReviews {
  rating: number
  comment: string
  user: mongoose.Types.ObjectId
  date: Date
}

export enum ServiceStatusList {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IService {
  name: string
  category: CATEGORIES
  subCategory: SUB_CATEGORIES
  price: number
  images: Images[]
  description: string
  availability?: boolean
  seller: mongoose.Types.ObjectId
  shop: mongoose.Types.ObjectId
  status: ServiceStatusList
  reviews: IReviews[]
  notes?: string
}

export interface IServiceDocument extends IService, Document {}

export interface IServiceModel extends Model<IServiceDocument> {
  // Custom model methods can be added here
  findByName(name: string): Promise<IServiceDocument | null>
}
