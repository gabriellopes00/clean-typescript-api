import { SignUpController } from '@presentation/controllers/signup/SignUp'
import { Controller } from '@presentation/interfaces'
import { EmailValidatorAdapter } from '@utils/emailValidatorAdapter'
import { DbAddAccount } from '@data/usecases/addAccount/DbAddAccount'
import { BcryptAdapter } from '@infra/cryptography/BcryptAdapter'
import { MongoAccountRepository } from '@infra/db/mongodb/accountRepository/Account'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, mongoAccountRepository)

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  )
  return new LogControllerDecorator(signUpController)
}
