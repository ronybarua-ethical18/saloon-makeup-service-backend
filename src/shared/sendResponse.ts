import { Response } from 'express'

type IApiResponse<T> = {
  statusCode: number
  success: boolean
  message: string | null
  meta?: {
    page?: number | undefined
    limit?: number | undefined
    total?: number | undefined
  }
  data?: T | null
}

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  }
  res.status(data.statusCode).send(responseData)
}

export default sendResponse
