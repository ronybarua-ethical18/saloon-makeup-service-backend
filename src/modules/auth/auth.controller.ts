import { Request, Response } from 'express'
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  ISignUpUserResponse,
} from './auth.interface'
import { AuthService } from './auth.service'
import tryCatchAsync from '../../shared/tryCatchAsync'
import config from '../../config'
import sendResponse from '../../shared/sendResponse'
import { IUser } from '../user/user.interface'

const signUpUser = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signUpUser(req.body)

  sendResponse<ISignUpUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Email verification link has been sent',
    data: result,
  })
})

const verifyEmail = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmail(req.body)

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'Email is verified successfully',
    data: result,
  })
})

const loginUser = tryCatchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await AuthService.loginUser(loginData)
  const { refreshToken } = result
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  })
})

const refreshToken = tryCatchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies

  const result = await AuthService.refreshToken(refreshToken)

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  })
})

export const AuthController = {
  loginUser,
  signUpUser,
  refreshToken,
  verifyEmail,
}
