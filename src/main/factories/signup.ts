import { SignUpController } from '@presentation/controllers/signup/SignUp'
import { EmailValidatorAdapter } from '@utils/emailValidatorAdapter'
import { DbAddAccount } from '@data/usecases/addAccount/DbAddAccount'
import { BcryptAdapter } from '@infra/cryptography/BcryptAdapter'
import { MongoAccountRepository } from '@infra/db/mongodb/accountRepository/Account'

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, mongoAccountRepository)

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  )
  return signUpController
}
