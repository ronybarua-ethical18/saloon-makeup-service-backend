import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import mongoose from 'mongoose'
import { ShopService } from './shop.service'
import { IShopDocument } from './shop.interface'
import pick from '../../shared/pick'
import { shopFilterableFields } from './shop.constants'
import { paginationFields } from '../../constants/pagination'

const createShop = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const result = await ShopService.createShop(loggedUser, req.body)

  sendResponse<IShopDocument>(res, {
    statusCode: 200,
    success: true,
    message: 'New Shop is created successfully',
    data: result,
  })
})

const getAllShop = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const filterOptions = pick(req.query, shopFilterableFields)
  const queryOptions = pick(req.query, paginationFields)
  const result = await ShopService.getAllShop(
    loggedUser,
    queryOptions,
    filterOptions,
  )

  sendResponse<IShopDocument[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All shop fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getShop = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.shopId === 'string') {
    const result = await ShopService.getShop(
      new mongoose.Types.ObjectId(req.params['shopId']),
    )

    sendResponse<IShopDocument>(res, {
      statusCode: 200,
      success: true,
      message: 'Single shop fetched successfully',
      data: result,
    })
  }
})

const updateShop = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  if (typeof req.params.shopId === 'string') {
    const result = await ShopService.updateShop(
      loggedUser,
      new mongoose.Types.ObjectId(req.params['shopId']),
      req.body,
    )

    sendResponse<IShopDocument>(res, {
      statusCode: 200,
      success: true,
      message: 'Shop updated successfully',
      data: result,
    })
  }
})

const deleteShop = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  if (typeof req.params.shopId === 'string') {
    await ShopService.deleteShop(
      loggedUser,
      new mongoose.Types.ObjectId(req.params['shopId']),
    )

    sendResponse<IShopDocument>(res, {
      statusCode: 200,
      success: true,
      message: 'Shop deleted successfully',
    })
  }
})

export const ShopController = {
  createShop,
  getShop,
  getAllShop,
  updateShop,
  deleteShop,
}
