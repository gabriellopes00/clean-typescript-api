import { Hasher } from '@data/interfaces/cryptography/hasher'
import { AddAccountRepository } from '@data/interfaces/db/account/add-account-repository'
import { LoadAccountRepository } from '@data/interfaces/db/account/load-account-repository'
import { AccountModel } from '@domain/models/account'
import { AddAccount, AddAccountParams } from '@domain/usecases/add-account'

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
      const newAccount = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword
      })

      return newAccount
    }

    return null
  }
}
