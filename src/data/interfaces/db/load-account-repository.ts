import { AccountModel } from '@domain/models/account'

export interface LoadAccountRepository {
  load(email: string): Promise<AccountModel>
}
