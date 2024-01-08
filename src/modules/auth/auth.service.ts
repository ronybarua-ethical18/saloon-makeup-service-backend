import httpStatus from 'http-status'
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

const signUpUser = async (
  payload: ILoginUser,
): Promise<ISignUpUserResponse> => {
  try {
    const { email } = payload

    const user = await UserModel.isEmailTaken(email)

    if (user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User already exist')
    }

    const newUser = await UserModel.create(payload)

    return newUser
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sign up failed')
  }
}

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  try {
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

    const accessToken = jwtHelpers.createToken(
      { userId: user?._id, role: user?.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string,
    )

    // create refresh token
    const refreshToken = jwtHelpers.createToken(
      { userId: user?._id, role: user?.role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string,
    )

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'login failed')
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

const verifyEmail = async (token: string): Promise<IUser | null> => {
  try {
    const { userId } = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret,
    )

    const user = await UserModel.findById({ _id: userId })
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
      isVerified: true,
    })
    return updatedUser
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed')
  }
}

export const AuthService = {
  loginUser,
  refreshToken,
  signUpUser,
  verifyEmail,
}
