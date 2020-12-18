import { AddAccountRepository } from '@dataInterfaces/addAccountRepository'
import { AddAccountModel } from '@domUsecases/addAccount'
import { AccountModel } from '@domModels/account'
import { MongoHelper } from '../helpers/index'

export class MongoAccountRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0] // account inserted

    return MongoHelper.map(account)
  }
}
