import { SortOrder } from 'mongoose'
import { IGenericErrorMessage } from './error.interface'

export type IGenericErrorResponse = {
  statusCode: number
  message: string
  errorMessages: IGenericErrorMessage[]
}

export type IGenericResponse<T> = {
  meta: {
    page: number
    limit: number
    total: number
    totalApproved?: number
    totalPending?: number
    totalRejected?: number
    totalBooked?: number
    totalCompleted?: number
    totalCancelled?: number
    totalRefunded?: number
    totalFailed?: number
  }
  data: T
}

export interface IPaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
}

export interface IFilterOptions {
  searchTerm?: string
  name?: string
  category?: string
  subCategory?: string
  status?: string
}

export interface IShopFilterOptions {
  searchTerm?: string
  shopName?: string
  location?: string
}
