import { Decrypter } from '@data/interfaces/cryptography/decrypter'
import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-interfaces'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decript(accessToken)
    return null
  }
}
