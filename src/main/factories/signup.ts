import { SignUpController } from '@presentation/controllers/signup/signup'
import { Controller } from '@presentation/interfaces'
import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { MongoAccountRepository } from '@infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '@infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, mongoAccountRepository)

  const signUpController = new SignUpController(
    makeSignUpValidation(),
    dbAddAccount
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
