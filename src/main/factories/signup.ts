import { SignUpController } from '@presentation/controllers/signup/SignUp'
import { Controller } from '@presentation/interfaces'
import { DbAddAccount } from '@data/usecases/addAccount/DbAddAccount'
import { BcryptAdapter } from '@infra/cryptography/BcryptAdapter'
import { MongoAccountRepository } from '@infra/db/mongodb/accountRepository/Account'
import { LogMongoRepository } from '@infra/db/mongodb/logRepository/log'
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
