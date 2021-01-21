import env from '../../config/env'
import { MongoAccountRepository } from '@infra/db/mongodb/account/mongo-account-repository'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '@data/usecases/authentication/db-authentication'
import { Authenticator } from '@domain/usecases/authentication'

export const makeDbAuthentication = (): Authenticator => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const mongoAccountRepository = new MongoAccountRepository()

  return new DbAuthentication(
    mongoAccountRepository,
    bcryptAdapter,
    jwtAdapter,
    mongoAccountRepository
  )
}
