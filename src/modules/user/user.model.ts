/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../config'
import { IUser, IUserModel } from './user.interface'

const UserSchema = new Schema<IUser, IUserModel>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      //   select: false
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.statics.isEmailTaken = async function (
  email: string,
): Promise<IUser | null> {
  return await this.findOne({ email: email })
}

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

UserSchema.pre('save', async function (next) {
  // hashing user password
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = this // Added type assertion
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )

  next()
})

export const UserModel = model<IUser, IUserModel>('user', UserSchema)
