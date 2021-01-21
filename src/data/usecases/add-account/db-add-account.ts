import { LoadAccountRepository } from '@data/interfaces/db/account/load-account-repository'
import {
  AddAccount,
  AddAccountModel,
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

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountRepository.loadByEmail(accountData.email)
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return account
  }
}
