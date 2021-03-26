import {
  fakeAccountModel,
  fakeLoginParams as fakeAuthParams
} from '../../../domain/mocks/mock-account'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../interfaces/cryptography/encrypter'
import { HashComparer } from '../../interfaces/cryptography/hash-comparer'
import { AccessTokenRepository } from '../../interfaces/db/account/access-token-repository'
import { LoadAccountRepository } from '../../interfaces/db/account/load-account-repository'
import { DbAuthentication } from './db-authentication'

class MockLoadAccountRepository implements LoadAccountRepository {
  async loadByEmail(email: string): Promise<AccountModel> {
    return new Promise(resolve => resolve(fakeAccountModel))
  }
}

class MockHashComparer implements HashComparer {
  async compare(value: string, hash: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}

class MockEncrypter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}

class MockAccessTokenRepository implements AccessTokenRepository {
  async storeAccessToken(id: string, token: string): Promise<void> {}
}

describe('DbAuthentication Usecase', () => {
  const mockLoadAccountRepository = new MockLoadAccountRepository() as jest.Mocked<MockLoadAccountRepository>
  const mockHashComparer = new MockHashComparer() as jest.Mocked<MockHashComparer>
  const mockEncrypter = new MockEncrypter() as jest.Mocked<MockEncrypter>
  const mockAccessTokenRepository = new MockAccessTokenRepository() as jest.Mocked<MockAccessTokenRepository>
  const sut = new DbAuthentication(
    mockLoadAccountRepository,
    mockHashComparer,
    mockEncrypter,
    mockAccessTokenRepository
  )

  describe('LoadAccount Repository', () => {
    test('Should call LoadAccountRepository with correct email', async () => {
      const loadByEmailSpy = jest.spyOn(mockLoadAccountRepository, 'loadByEmail')
      await sut.authenticate(fakeAuthParams)
      expect(loadByEmailSpy).toHaveBeenCalledWith(fakeAuthParams.email)
    })

    test('Should throw if LoadAccountRepository throws', async () => {
      mockLoadAccountRepository.loadByEmail.mockRejectedValueOnce(new Error())
      const promiseError = sut.authenticate(fakeAuthParams)
      await expect(promiseError).rejects.toThrow()
    })

    test('Should return null if LoadAccountRepository returns null', async () => {
      mockLoadAccountRepository.loadByEmail.mockReturnValueOnce(null)
      const model = await sut.authenticate(fakeAuthParams)
      expect(model).toBeNull()
    })
  })

  describe('Hash Comparer', () => {
    test('Should call HashComparer with correct values', async () => {
      const compareSpy = jest.spyOn(mockHashComparer, 'compare')
      await sut.authenticate(fakeAuthParams)
      expect(compareSpy).toHaveBeenCalledWith(fakeAuthParams.password, fakeAccountModel.password)
    })

    test('Should throw if HashComparer throws', async () => {
      mockHashComparer.compare.mockRejectedValueOnce(new Error())
      const promiseError = sut.authenticate(fakeAuthParams)
      await expect(promiseError).rejects.toThrow()
    })

    test('Should return null if HashComparer returns false', async () => {
      mockHashComparer.compare.mockResolvedValueOnce(false)
      const model = await sut.authenticate(fakeAuthParams)
      expect(model).toBeNull()
    })
  })

  describe('Encrypter', () => {
    test('Should call Encrypter with correct id', async () => {
      const generateSpy = jest.spyOn(mockEncrypter, 'encrypt')
      await sut.authenticate(fakeAuthParams)
      expect(generateSpy).toHaveBeenCalledWith(fakeAccountModel.id)
    })

    test('Should throw if Encrypter throws', async () => {
      mockEncrypter.encrypt.mockRejectedValueOnce(new Error())
      const promiseError = sut.authenticate(fakeAuthParams)
      await expect(promiseError).rejects.toThrow()
    })

    test('Should return an authentication model on success', async () => {
      const { accessToken, name } = await sut.authenticate(fakeAuthParams)
      expect(accessToken).toBe('any_token')
      expect(name).toBe(fakeAccountModel.name)
    })
    test('Should throw if Encrypter throws', async () => {
      mockEncrypter.encrypt.mockRejectedValueOnce(new Error())

      const promiseError = sut.authenticate(fakeAuthParams)
      await expect(promiseError).rejects.toThrow()
    })
  })

  describe('AccessToken Repository', () => {
    test('Should call AccessTokenRepository with correct values', async () => {
      const storeAccessTokenSpy = jest.spyOn(mockAccessTokenRepository, 'storeAccessToken')
      await sut.authenticate(fakeAuthParams)
      expect(storeAccessTokenSpy).toHaveBeenCalledWith(fakeAccountModel.id, 'any_token')
    })

    test('Should throw if AccessTokenRepository throws', async () => {
      mockAccessTokenRepository.storeAccessToken.mockRejectedValueOnce(new Error())
      const promiseError = sut.authenticate(fakeAuthParams)
      await expect(promiseError).rejects.toThrow()
    })
  })
})
