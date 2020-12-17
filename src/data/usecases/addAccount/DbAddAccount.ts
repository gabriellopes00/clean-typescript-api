import { AddAccount, AddAccountModel } from '@domUsecases/addAccount'
import { AccountModel } from '@domModels/account'
import { Encrypter } from '@dataInterfaces/encrypter'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
