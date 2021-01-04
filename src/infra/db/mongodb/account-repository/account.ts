import { AddAccountRepository } from '@data/interfaces/add-account-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models/account'
import { MongoHelper } from '../helpers/index'

export class MongoAccountRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0] // account inserted

    return MongoHelper.map(account)
  }
}