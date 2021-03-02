import { AddAccountParams } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models/account'

export interface AddAccountRepository {
  add(accountData: AddAccountParams): Promise<AccountModel>
}
