import bcrypt from 'bcryptjs'
import catchAsync from '../../utils/catchAsync.js'
import emailService from '../../services/email.service.js'
import { generateOTP } from './auth.util.js'
import {
  NotFoundError,
  ValidationError,
} from '../../middlewares/errorHandler.js'
import type {
  RegisterSchema,
  LoginSchema,
  VerifyEmailSchema,
} from './auth.validation.js'
import User from '../user/user.model.js'
import Token from './token.model.js'
import authService from './auth.service.js'

const register = catchAsync(async (req, res) => {
  let newUser: RegisterSchema = req.body

  const user = await User.findOne({ email: newUser.email })
  if (user) throw new ValidationError('This email already exists')

  newUser.password = await bcrypt.hash(newUser.password, 10)

  const savedUser = await User.create(newUser)

  const { otp, expiresAt } = generateOTP()

  await Token.updateOne(
    { email: savedUser.email },
    {
      $set: {
        otp,
        expiresAt,
        email: savedUser.email,
        type: 'VERIFY_EMAIL',
      },
    },
    { upsert: true }
  )
  await emailService.sendEmailVerificationRequestMail(savedUser, otp)

  res.status(201).json({
    success: true,
    message: 'Please check your email to verify your account.',
  })
})

const login = catchAsync(async (req, res) => {
  let newUser: LoginSchema = req.body

  const user = await User.findOne({ email: newUser.email })
  if (!user) throw new ValidationError('Invalid credentials')

  const isMatch = await bcrypt.compare(newUser.password, user.password)
  if (!isMatch) throw new ValidationError('Invalid credentials')

  if (!user.isVerified) {
    const { otp, expiresAt } = generateOTP()

    await Token.updateOne(
      { email: user.email },
      {
        $set: {
          otp,
          expiresAt,
          email: user.email,
          type: 'VERIFY_EMAIL',
        },
      },
      { upsert: true }
    )
    await emailService.sendEmailVerificationRequestMail(user, otp)

    throw new ValidationError('verify-email')
  }

  delete (user as any).password

  const tokens = await authService.generateAndSaveAuthTokens(user.id)

  res.status(200).json({
    success: true,
    data: {
      accessToken: tokens.access.token,
      refreshToken: tokens.refresh.token,
    },
    message: 'Login successful',
  })
})

const verifyEmail = catchAsync(async (req, res) => {
  const { email, otp }: VerifyEmailSchema = req.body

  const user = await User.findOne({ email })
  if (!user) throw new NotFoundError('User not found')

  const token = await Token.findOne({
    email,
    otp,
    type: 'VERIFY_EMAIL',
  })
  if (!token) {
    throw new ValidationError('Invalid OTP')
  }

  if (token.expiresAt < new Date()) {
    const { otp, expiresAt } = generateOTP()

    await Token.updateOne(
      { email: user.email },
      {
        $set: {
          otp,
          expiresAt,
          email: user.email,
          type: 'VERIFY_EMAIL',
        },
      },
      { upsert: true }
    )
    await emailService.sendEmailVerificationRequestMail(user, otp)

    throw new ValidationError('OTP expired. A new one has been sent.')
  }
  await Token.deleteOne({ id: token.id })

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { is_verified: true }
  )
  if (!updatedUser) throw new NotFoundError('User not found')

  await emailService.sendWelcomeMail(updatedUser.email, updatedUser.firstName)

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  })
})

const getProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id

  const user = await User.findOne({ id: userId })
  if (!user) throw new NotFoundError('User not found')

  delete (user as any).password

  res.status(200).json({
    success: true,
    data: user,
  })
})

const logout = catchAsync((req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})

export default {
  register,
  login,
  verifyEmail,
  getProfile,
  logout,
}
