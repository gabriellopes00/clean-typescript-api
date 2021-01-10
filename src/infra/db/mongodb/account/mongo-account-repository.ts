import { AddAccountRepository } from '@data/interfaces/db/account/add-account-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models/account'
import { MongoHelper } from '../helpers/index'
import { LoadAccountRepository } from '@data/interfaces/db/account/load-account-repository'
import { AccessTokenRepository } from '@data/interfaces/db/account/access-token-repository'

export class MongoAccountRepository // eslint-disable-next-line indent
  implements
    AddAccountRepository,
    LoadAccountRepository,
    AccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0] // account inserted

    return MongoHelper.map(account)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    return account !== null ? MongoHelper.map(account) : null
  }

  async storeAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: id },
      {
        $set: { accessToken: token }
      }
    )
  }
}
