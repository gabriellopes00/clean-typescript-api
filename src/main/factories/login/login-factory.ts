import { Controller } from '@presentation/interfaces/controller'
import { LoginController } from '@presentation/controllers/login/login-controller'
import { makeLoginValidation } from '../../factories/login/login-validation-factory'
import { makeDbAuthentication } from '../usecases/db-authentication-factory'
import { makeLogController } from '../decorators/log-controller-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeLoginValidation(),
    makeDbAuthentication()
  )

  return makeLogController(controller)
}
