import { LoadAccountRepository } from '../../interfaces/db/load-account-repository'
import { HashComparer } from '../../interfaces/cryptography/hash-comparer'
import { Encrypter } from '../../interfaces/cryptography/encrypter'
import { AccessTokenRepository } from '../../interfaces/db/access-token-repository'
import {
  AuthenticationModel,
  Authenticator
} from '@domain/usecases/authentication'

export class DbAuthentication implements Authenticator {
  constructor(
    private readonly loadAccountRepository: LoadAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly accessTokenRepository: AccessTokenRepository
  ) {}

  async authenticate(data: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountRepository.load(data.email)
    if (account) {
      const isValid = await this.hashComparer.compare(
        data.password,
        account.password
      )
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.accessTokenRepository.store(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
