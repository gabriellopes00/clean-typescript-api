import { LoadAccountRepository } from '../../interfaces/db/load-account-repository'
import { HashComparer } from '../../interfaces/cryptography/hash-comparer'
import {
  AuthenticationModel,
  Authenticator
} from '@domain/usecases/authentication'
import { TokenGenerator } from '@data/interfaces/cryptography/token-generator'

export class DbAuthentication implements Authenticator {
  constructor(
    private readonly loadAccountRepository: LoadAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async authenticate(data: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountRepository.load(data.email)
    if (account) {
      await this.hashComparer.compare(data.password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return null
  }
}
