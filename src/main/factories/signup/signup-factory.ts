import { SignUpController } from '@presentation/controllers/signup/signup-controller'
import { Controller } from '@presentation/interfaces'
import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { MongoAccountRepository } from '@infra/db/mongodb/account/mongo-account-repository'
import { MongoLogRepository } from '@infra/db/mongodb/log/mongo-log-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, mongoAccountRepository)

  const signUpController = new SignUpController(
    makeSignUpValidation(),
    dbAddAccount
  )
  const mongoLogRepository = new MongoLogRepository()
  return new LogControllerDecorator(signUpController, mongoLogRepository)
}
