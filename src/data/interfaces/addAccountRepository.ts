import { AddAccountModel } from '@domUsecases/addAccount'
import { AccountModel } from '@domModels/account'

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}
