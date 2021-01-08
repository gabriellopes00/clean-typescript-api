import { AccountModel } from '@domain/models/account'

export interface LoadAccountRepository {
  loadByEmail(email: string): Promise<AccountModel>
}
