import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js'
import config from '../config/config.js'
import type { JwtPayload } from '../types/index.js'

const authenticate = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.Authorization
      if (!token) throw new UnauthenticatedError('No token provided')

      const payload = jwt.verify(
        token as string,
        config.jwt.ACCESS_TOKEN_SECRET
      ) as JwtPayload

      const user = ''

      if (!user) {
        throw new UnauthorizedError('Access denied')
      }

      req.user = user
      next()
    } catch (err) {
      next(err)
    }
  }
}

export { authenticate }
