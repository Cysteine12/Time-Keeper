import type { JwtPayload } from './index.ts'

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload
  }
}
