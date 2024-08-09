import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import mongoose from 'mongoose'
import { SaloonService } from './service.service'
import { IService } from './service.interface'
import pick from '../../shared/pick'
import { paginationFields } from '../../constants/pagination'
import { filterableFields } from './service.constants'
import { ServiceModel } from './service.model'
import ShopModel from '../shop/shop.model'

const createService = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }

  const result = await SaloonService.createService(loggedUser, req.body)

  sendResponse<IService>(res, {
    statusCode: 200,
    success: true,
    message: 'New service created successfully',
    data: result,
  })
})

const getAllServices = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const filterOptions = pick(req.query, filterableFields)
  const queryOptions = pick(req.query, paginationFields)

  const result = await SaloonService.getAllServices(
    loggedUser,
    queryOptions,
    filterOptions,
  )

  // const isExistsInRedis = await redis.exists('services')

  // if (isExistsInRedis) {
  //   const redisData: any = await redis.get('services')

  //   const parsedData = JSON.parse(redisData)

  //   return sendResponse<IService[]>(res, {
  //     statusCode: 200,
  //     success: true,
  //     message: 'All services fetched successfully from redis',
  //     meta: parsedData.meta,
  //     data: parsedData.data,
  //   })
  // }

  // // Serialize the data to a JSON string
  // const dataToCache = JSON.stringify({name:"rony"})

  // // Store the data in Redis
  // await redis.set('services', dataToCache)

  sendResponse<IService[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All services fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getTopServices = tryCatchAsync(async (req: Request, res: Response) => {
  const queryOptions = pick(req.query, paginationFields)

  const result = await SaloonService.getTopServices(queryOptions)

  sendResponse<IService[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Top services fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getService = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.serviceId === 'string') {
    const result = await SaloonService.getService(
      new mongoose.Types.ObjectId(req.params['serviceId']),
    )

    sendResponse<IService>(res, {
      statusCode: 200,
      success: true,
      message: 'Single service fetched successfully',
      data: result,
    })
  }
})

const updateService = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  if (typeof req.params.serviceId === 'string') {
    const result = await SaloonService.updateService(
      loggedUser,
      new mongoose.Types.ObjectId(req.params['serviceId']),
      req.body,
    )

    sendResponse<IService>(res, {
      statusCode: 200,
      success: true,
      message: 'Service updated successfully',
      data: result,
    })
  }
})

const deleteService = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  if (typeof req.params.serviceId === 'string') {
    await SaloonService.deleteService(
      loggedUser,
      new mongoose.Types.ObjectId(req.params['serviceId']),
    )

    sendResponse<IService>(res, {
      statusCode: 200,
      success: true,
      message: 'Service deleted successfully',
    })
  }
})

const updateManyServices = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const shops = await ShopModel.find({})
  const services = await ServiceModel.find({})

  Promise.all(
    services.map(async service => {
      const shop = shops.find(
        shop => shop.seller.toString() === service.seller.toString(),
      )

      if (shop) {
        await ServiceModel.findOneAndUpdate(
          { _id: service._id },
          { shop: shop._id },
          { new: true },
        )
      }
    }),
  )

  sendResponse<IService>(res, {
    statusCode: 200,
    success: true,
    message: 'Services updated successfully',
  })
}

export const SaloonServiceController = {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
  updateManyServices,
  getTopServices,
}
