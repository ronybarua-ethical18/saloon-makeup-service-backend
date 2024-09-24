import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import { IUser } from '../user/user.interface'
import { UserService } from './user.service'
import mongoose from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'

const getAllUsers = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const result = await UserService.getAllUsers(loggedUser)

  sendResponse<IUser[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All  users fetched successfully',
    data: result,
  })
})

const getUser = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.userId === 'string') {
    const result = await UserService.getUser(
      new mongoose.Types.ObjectId(req.params['userId']),
    )

    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: 'Single user fetched successfully',
      data: result,
    })
  }
})

const updateUser = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.userId === 'string') {
    console.log('req.body', req.body, req.params.userId)
    const result = await UserService.updateUser(
      new mongoose.Types.ObjectId(req.params['userId']),
      req.body,
    )

    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: result,
    })
  }
})

const deleteUser = tryCatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params as JwtPayload
  await UserService.deleteUser(userId)

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
  })
})

export const UserController = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
}
