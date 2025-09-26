import { Types } from 'mongoose'

export type JwtPayload = {
  id: Types.ObjectId
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  total?: number
}

export interface TokenResponse {
  token: string
  expires: number
}

export interface AuthTokenResponse {
  access: TokenResponse
  refresh: TokenResponse
}
