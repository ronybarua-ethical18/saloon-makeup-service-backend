/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../errors/ApiError'
import { IShopDocument } from './shop.interface'
import ShopModel from './shop.model'
import { JwtPayload } from 'jsonwebtoken'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import mongoose, { SortOrder } from 'mongoose'
import { paginationHelpers } from '../../helpers/pagination'
import {
  IGenericResponse,
  IPaginationOptions,
  IShopFilterOptions,
} from '../../shared/interfaces/common.interface'
import { queryFieldsManipulation } from '../../helpers/queryFieldsManipulation'

const createShop = async (
  loggedUser: JwtPayload,
  shopPayload: IShopDocument,
): Promise<IShopDocument> => {
  console.log('shop payload', shopPayload)
  if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
    const shop = await ShopModel.findOneAndUpdate(
      { seller: loggedUser.userId },
      { ...shopPayload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    return shop
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not a seller')
  }
}

const getShop = async (
  shopId: mongoose.Types.ObjectId,
): Promise<IShopDocument> => {
  const shop = await ShopModel.findById({ _id: shopId })

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found')
  }

  return shop
}
const updateShop = async (
  loggedUser: JwtPayload,
  shopId: mongoose.Types.ObjectId,
  updatePayload: object,
): Promise<IShopDocument | null> => {
  console.log('update payload from shop', updatePayload)
  const queryPayload = {
    _id: shopId,
  } as {
    _id: mongoose.Types.ObjectId
    seller: mongoose.Types.ObjectId
  }
  if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
    queryPayload.seller = loggedUser.userId
  }
  const shop = await ShopModel.findOne(queryPayload)

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found')
  }
  const updateShop = await ShopModel.findByIdAndUpdate(
    { _id: shopId },
    { ...updatePayload },
    { new: true },
  )

  return updateShop
}

const deleteShop = async (
  loggedUser: JwtPayload,
  shopId: mongoose.Types.ObjectId,
): Promise<void> => {
  const queryPayload: {
    _id: mongoose.Types.ObjectId
    seller?: mongoose.Types.ObjectId
  } = {
    _id: shopId,
  }

  if (loggedUser.role === ENUM_USER_ROLE.SELLER) {
    queryPayload.seller = loggedUser.userId
  }

  const shop = await ShopModel.findOneAndDelete(queryPayload)

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found')
  }
}

const getAllShop = async (
  loggedUser: JwtPayload,
  queryOptions: IPaginationOptions,
  filterOptions: IShopFilterOptions,
): Promise<IGenericResponse<IShopDocument[]>> => {
  if (
    loggedUser.role === ENUM_USER_ROLE.ADMIN ||
    loggedUser.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    const queryPayload = {} as any

    const { searchTerm, ...filterableFields } = filterOptions
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(queryOptions)

    const sortCondition: { [key: string]: SortOrder } = {}

    if (sortBy && sortOrder) {
      sortCondition[sortBy] = sortOrder
    }

    const queriesWithFilterableFields = queryFieldsManipulation(
      searchTerm,
      ['shopName', 'location'],
      filterableFields,
    )

    if (queriesWithFilterableFields.length) {
      queryPayload.$and = queriesWithFilterableFields
    }

    const shopList = await ShopModel.find(queryPayload)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)

    const total = await ShopModel.countDocuments()
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: shopList,
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized')
  }
}

export const ShopService = {
  createShop,
  getShop,
  getAllShop,
  updateShop,
  deleteShop,
}
