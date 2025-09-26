import express from 'express'
import validate from '../../middlewares/validate.js'
import authValidation from './auth.validation.js'
import authController from './auth.controller.js'
import { authenticate } from '../../middlewares/auth.js'

const router = express.Router()

router.post(
  '/register',
  validate(authValidation.registerSchema),
  authController.register
)

router.post(
  '/login',
  validate(authValidation.loginSchema),
  authController.login
)

router.post(
  '/verify-email',
  validate(authValidation.verifyEmailSchema),
  authController.verifyEmail
)

router.post('/refresh-token', authController.refreshToken)

router.get('/profile', authenticate, authController.getProfile)

router.post('/logout', authController.logout)

export default router
