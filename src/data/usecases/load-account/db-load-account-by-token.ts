import { Decrypter } from '@data/interfaces/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '@data/interfaces/db/account/load-account-by-token-repository'
import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-interfaces'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decript(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        token,
        role
      )
      if (account) return account
    }
    return null
  }
}
