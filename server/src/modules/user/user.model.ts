import { Schema, model, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      min: 7,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export type IUser = InferSchemaType<typeof userSchema>

export default model<IUser>('User', userSchema)
