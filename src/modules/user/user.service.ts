import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'
import mongoose from 'mongoose'
import { IUser } from './user.interface'
import ApiError from '../../errors/ApiError'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import ShopModel from '../shop/shop.model'
import { IShopDocument } from '../shop/shop.interface'

const getUser = async (
  userId: mongoose.Types.ObjectId,
): Promise<IUser | (IUser & { shop: IShopDocument })> => {
  const user = await UserModel.findById({ _id: userId })
    .lean()
    .select('-password')

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  if (user.role === ENUM_USER_ROLE.SELLER) {
    const shop = await ShopModel.findOne({ seller: user._id })

    if (shop) {
      return { ...user, shop }
    }
    return user
  }

  return user
}
const updateUser = async (
  userId: mongoose.Types.ObjectId,
  updatePayload: object,
): Promise<IUser | null> => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, updatePayload, {
    new: true,
    runValidators: true,
  })

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  console.log('updated user', updatedUser)

  return updatedUser
}

const deleteUser = async (userId: mongoose.Types.ObjectId): Promise<void> => {
  const user = await UserModel.findById({ _id: userId })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  await UserModel.findByIdAndDelete({ _id: user._id })
}

const getAllUsers = async (loggedUser: {
  userId: mongoose.Types.ObjectId
}): Promise<IUser[]> => {
  const admin = await UserModel.findOne({
    _id: loggedUser.userId,
    role: { $in: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN] },
  })
  if (admin) {
    return await UserModel.find({})
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized')
  }
}

export const UserService = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
}
