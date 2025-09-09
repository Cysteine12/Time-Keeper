import type { InferSchemaType } from 'mongoose'
import { Schema, model } from 'mongoose'

const tokenSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    otp: {
      type: String,
      min: 6,
      max: 6,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['VERIFY_EMAIL'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export type IToken = InferSchemaType<typeof tokenSchema>

export default model<IToken>('Token', tokenSchema)
