import { LoadAccountRepository } from '../../interfaces/db/load-account-repository'
import {
  AuthenticationModel,
  Authenticator
} from '@domain/usecases/authentication'

export class DbAuthentication implements Authenticator {
  constructor(private readonly loadAccountRepository: LoadAccountRepository) {}

  async authenticate(data: AuthenticationModel): Promise<string> {
    await this.loadAccountRepository.load(data.email)
    return null
  }
}
