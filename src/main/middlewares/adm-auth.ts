import { adaptMiddleware } from '@main/adapters/express-middleware'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth-middleware'

export const AdmAuth = adaptMiddleware(makeAuthMiddleware('admin'))
