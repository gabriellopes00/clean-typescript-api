import { Middleware } from '@presentation/interfaces/middleware'
import { AuthMiddleware } from '@presentation/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '../usecases/db-load-account-by-token'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
