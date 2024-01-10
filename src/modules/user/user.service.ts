import httpStatus from 'http-status'
import { UserModel } from '../user/user.model'
import mongoose from 'mongoose'
import { IUser } from './user.interface'
import ApiError from '../../errors/ApiError'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'

const getUser = async (userId: mongoose.Types.ObjectId): Promise<IUser> => {
  const user = await UserModel.findById({ _id: userId })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  return user
}
const updateUser = async (
  userId: mongoose.Types.ObjectId,
  updatePayload: object,
): Promise<IUser | null> => {
  const user = await UserModel.findById({ _id: userId })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    { _id: user._id },
    { ...updatePayload },
    { new: true },
  )

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
