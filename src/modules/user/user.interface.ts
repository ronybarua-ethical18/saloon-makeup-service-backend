/* eslint-disable no-unused-vars */
import { Model, Schema } from 'mongoose'

export type IUser = {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  address: string
  password?: string
  isVerified?: boolean
  img?: string
  bio?: string
}

export interface IUserModel extends Model<IUser> {
  isUserExist(id: Schema.Types.ObjectId): unknown
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string | unknown,
  ): unknown
  isEmailTaken(email: string): Promise<boolean>
}
