import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { Secret } from 'jsonwebtoken'
import { UserModel } from '../user/user.model'
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  ISignUpUserResponse,
} from './auth.interface'
import ApiError from '../../errors/ApiError'
import { jwtHelpers } from '../../helpers/jwtHelpers'
import config from '../../config'
import { IUser } from '../user/user.interface'
import {
  FORGOT_PASSWORD_TEMPLATE,
  VERIFY_EMAIL_TEMPLATE,
} from '../../services/mail/constants'
import { sendMailWithToken } from '../../utils/auth.utils'

const signUpUser = async (
  payload: ILoginUser,
): Promise<ISignUpUserResponse> => {
  const { email } = payload

  const user = await UserModel.isEmailTaken(email)

  if (user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User already exist')
  }

  const newUser = await UserModel.create(payload)

  sendMailWithToken(
    newUser,
    'StyleVibe - Verify your e-mail',
    'verify-email',
    VERIFY_EMAIL_TEMPLATE,
  )

  return newUser
}

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload

  const user = (await UserModel.findOne({ email: email })) || null

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  if (!user.isVerified) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is not verified yet')
  }
  const isPasswordMatched = await UserModel.isPasswordMatched(
    password,
    user.password,
  )

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  const tokenPayload = {
    userId: user?._id,
    role: user?.role,
    firstName: user?.firstName,
    lastName: user?.lastName,
  }

  const accessToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )

  // create refresh token
  const refreshToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
  }
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    )

    const { userId } = verifiedToken

    const user = await UserModel.findById({ _id: userId })
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
    }

    const newAccessToken = jwtHelpers.createToken(
      {
        id: user._id,
        role: user.role,
      },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string,
    )

    return {
      accessToken: newAccessToken,
    }
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token')
  }
}

const verifyEmail = async (token: string): Promise<void> => {
  console.log('token', token)

  const { userId } = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)

  const user = await UserModel.findById({ _id: userId })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  await UserModel.findByIdAndUpdate(user._id, {
    isVerified: true,
  })
}

const forgotPassword = async (email: string): Promise<IUser> => {
  const user = await UserModel.findOne({ email: email })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  sendMailWithToken(
    user,
    'StyleVibe - Password Reset',
    'reset-password',
    FORGOT_PASSWORD_TEMPLATE,
  )

  return user
}

export const resetPassword = async (payload: {
  token: string
  newPassword: string
}): Promise<void> => {
  const { userId } = await jwtHelpers.verifyToken(
    payload.token,
    config.jwt.secret as Secret,
  )
  const user = await UserModel.findById({ _id: userId })
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found')
  }

  const hash = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  await UserModel.findByIdAndUpdate(user._id, {
    password: hash,
  })
}

export const AuthService = {
  loginUser,
  refreshToken,
  signUpUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
}
