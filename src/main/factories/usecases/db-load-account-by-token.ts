import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { DbLoadAccountByToken } from '@data/usecases/load-account/db-load-account-by-token'
import { MongoAccountRepository } from '@infra/db/mongodb/account/mongo-account-repository'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const mongoAccountRepository = new MongoAccountRepository()
  const decrypter = new JwtAdapter(env.jwtSecret)
  return new DbLoadAccountByToken(decrypter, mongoAccountRepository)
}
