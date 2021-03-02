import { LoadAccountRepository } from '@data/interfaces/db/account/load-account-repository'
import {
  AddAccount,
  AddAccountParams,
  AccountModel,
  AddAccountRepository,
  Hasher
} from './db-add-account-interfaces'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountRepository: LoadAccountRepository
  ) {}

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const newAccount = await this.addAccountRepository.add(
        Object.assign({}, accountData, { password: hashedPassword })
      )
      return newAccount
    }

    return null
  }
}
