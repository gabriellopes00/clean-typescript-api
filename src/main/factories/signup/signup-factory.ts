import { SignUpController } from '@presentation/controllers/signup/signup-controller'
import { Controller } from '@presentation/interfaces'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../usecases/db-authentication-factory'
import { makeDbAddAccount } from '../usecases/db-add-account-factory'
import { makeLogController } from '../decorators/log-controller-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeSignUpValidation(),
    makeDbAddAccount(),
    makeDbAuthentication()
  )
  return makeLogController(controller)
}
