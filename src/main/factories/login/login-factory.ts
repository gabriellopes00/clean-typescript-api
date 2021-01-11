import env from '../../config/env'
import { Controller } from '@presentation/interfaces/controller'
import { LoginController } from '@presentation/controllers/login/login-controller'
import { MongoLogRepository } from '@infra/db/mongodb/log/mongo-log-repository'
import { MongoAccountRepository } from '@infra/db/mongodb/account/mongo-account-repository'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '@data/usecases/authentication/db-authentication'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from '../../factories/login/login-validation-factory'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const mongoAccountRepository = new MongoAccountRepository()

  const dbAuthentication = new DbAuthentication(
    mongoAccountRepository,
    bcryptAdapter,
    jwtAdapter,
    mongoAccountRepository
  )

  const loginController = new LoginController(
    makeLoginValidation(),
    dbAuthentication
  )
  const mongoLogRepository = new MongoLogRepository()

  return new LogControllerDecorator(loginController, mongoLogRepository)
}
