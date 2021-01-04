import { AccountModel } from '@domModels/account'

export interface AddAccountModel {
  name: string
  email: string
  password: string
  // passwordConfirmation: string
}

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>
}
