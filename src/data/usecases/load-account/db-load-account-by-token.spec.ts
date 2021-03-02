import { Decrypter } from '../../../data/interfaces/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenRepository } from '../../interfaces/db/account/load-account-by-token-repository'
import { fakeAccountModel } from '../../../domain/mocks/mock-account'

class MockDecrypter implements Decrypter {
  async decript(value: string): Promise<string> {
    return 'any_token'
  }
}

class MockLoadAccountByTokenRepository implements LoadAccountByTokenRepository {
  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    return { ...fakeAccountModel, password: 'hashed_password' }
  }
}

describe('DbLoadAccountByToken', () => {
  const mockDecrypter = new MockDecrypter() as jest.Mocked<MockDecrypter>
  const mockLoadAccountByTokenRepository = new MockLoadAccountByTokenRepository() as jest.Mocked<MockLoadAccountByTokenRepository>
  const sut = new DbLoadAccountByToken(mockDecrypter, mockLoadAccountByTokenRepository)

  describe('Decrypter', () => {
    test('Should call decrypter with correct values', async () => {
      const decryptSpy = jest.spyOn(mockDecrypter, 'decript')
      await sut.load('any_token', 'any_role')
      expect(decryptSpy).toHaveBeenLastCalledWith('any_token')
    })

    test('Should return null if decrypter returns null', async () => {
      mockDecrypter.decript.mockReturnValueOnce(null)
      const account = await sut.load('any_token', 'any_role')
      expect(account).toBeNull()
    })

    test('Should throw if Decrypter throws', async () => {
      mockDecrypter.decript.mockRejectedValueOnce(new Error())
      const promise = sut.load('any_token', 'any_role')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadAccountByToken Repository', () => {
    test('Should call LoadAccountByTokenRepository with correct values', async () => {
      const loadSpy = jest.spyOn(mockLoadAccountByTokenRepository, 'loadByToken')
      await sut.load('any_token', 'any_role')
      expect(loadSpy).toHaveBeenLastCalledWith('any_token', 'any_role')
    })

    test('Should return null if loadAccountRepository returns null', async () => {
      mockLoadAccountByTokenRepository.loadByToken.mockReturnValueOnce(null)
      const account = await sut.load('any_token', 'any_role')
      expect(account).toBeNull()
    })

    test('Should return null if loadAccountRepository returns null', async () => {
      const account = await sut.load('any_token', 'any_role')
      expect(account).toEqual({ ...fakeAccountModel, password: 'hashed_password' })
    })

    test('Should throw if LoadAccountByTokenRepository throws', async () => {
      mockLoadAccountByTokenRepository.loadByToken.mockRejectedValueOnce(new Error())
      const promise = sut.load('any_token', 'any_role')
      await expect(promise).rejects.toThrow()
    })
  })
})
