import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { MongoAccountRepository } from '@infra/db/mongodb/account/mongo-account-repository'
export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()
  return new DbAddAccount(bcryptAdapter, mongoAccountRepository)
}
