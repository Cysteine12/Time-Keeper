import jwt from 'jsonwebtoken'
import { type AuthTokenResponse } from '../../types/index.js'
import config from '../../config/config.js'

const generateToken = (payload: object, secret: string, expiresIn: number) => {
  return jwt.sign(payload, secret, { expiresIn })
}

const generateAndSaveAuthTokens = async (
  userId: string
): Promise<AuthTokenResponse> => {
  const accessTokenExpires = 15 * 60 * 1000
  const refreshTokenExpires = 7 * 24 * 60 * 60 * 1000

  const accessToken = generateToken(
    {
      sub: userId,
      type: 'ACCESS',
    },
    config.jwt.ACCESS_TOKEN_SECRET,
    accessTokenExpires
  )

  const refreshToken = generateToken(
    {
      sub: userId,
      type: 'REFRESH',
    },
    config.jwt.REFRESH_TOKEN_SECRET,
    refreshTokenExpires
  )

  return {
    access: { token: accessToken, expires: accessTokenExpires },
    refresh: { token: refreshToken, expires: refreshTokenExpires },
  }
}

export default {
  generateToken,
  generateAndSaveAuthTokens,
}
