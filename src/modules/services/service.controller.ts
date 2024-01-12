import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import mongoose from 'mongoose'
import { SaloonService } from './service.service'
import { IService } from './service.interface'

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
  const result = await SaloonService.getAllServices(loggedUser)

  sendResponse<IService[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All services fetched successfully',
    data: result,
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

export const SaloonServiceController = {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
}
