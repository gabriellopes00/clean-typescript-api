import { Router } from 'express'
import { makeLoginController } from '../factories/login/login-factory'
import { adaptRoutes } from '../adapters/express-routes'

const loginController = makeLoginController()

export default (router: Router): void => {
  router.post('/login', adaptRoutes(loginController))
}
