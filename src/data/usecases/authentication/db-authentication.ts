import { AuthenticationParams, Authenticator } from '@domain/usecases/authentication'
import { Encrypter } from '../../interfaces/cryptography/encrypter'
import { HashComparer } from '../../interfaces/cryptography/hash-comparer'
import { AccessTokenRepository } from '../../interfaces/db/account/access-token-repository'
import { LoadAccountRepository } from '../../interfaces/db/account/load-account-repository'

export class DbAuthentication implements Authenticator {
  constructor(
    private readonly loadAccountRepository: LoadAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly accessTokenRepository: AccessTokenRepository
  ) {}

  async authenticate(data: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountRepository.loadByEmail(data.email)
    if (account) {
      const isValid = await this.hashComparer.compare(data.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.accessTokenRepository.storeAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
