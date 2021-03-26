import { Decrypter } from '@data/interfaces/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '@data/interfaces/db/account/load-account-by-token-repository'
import { AccountModel } from '@domain/models/account'
import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    let token: string = null
    try {
      token = await this.decrypter.decript(accessToken)
    } catch (error) {
      return null
    }

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) return account
    }
    return null
  }
}
