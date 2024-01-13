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
}
