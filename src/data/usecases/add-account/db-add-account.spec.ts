import { fakeAccountModel, fakeAccountParams } from '../../../domain/mocks/mock-account'
import { AccountModel } from '../../../domain/models/account'
import { AddAccountParams } from '../../../domain/usecases/add-account'
import { Hasher } from '../../interfaces/cryptography/hasher'
import { AddAccountRepository } from '../../interfaces/db/account/add-account-repository'
import { LoadAccountRepository } from '../../interfaces/db/account/load-account-repository'
import { DbAddAccount } from './db-add-account'

class MockHasher implements Hasher {
  async hash(value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}
class MockAddAccountRepository implements AddAccountRepository {
  async add(values: AddAccountParams): Promise<AccountModel> {
    return new Promise(resolve => resolve(fakeAccountModel))
  }
}

class MockLoadAccountRepository implements LoadAccountRepository {
  async loadByEmail(email: string): Promise<AccountModel> {
    return new Promise(resolve => resolve(null))
  }
}

describe('DbAccount Usecase', () => {
  const mockHasher = new MockHasher() as jest.Mocked<MockHasher>
  const mockAddAccountRepository = new MockAddAccountRepository() as jest.Mocked<MockAddAccountRepository>
  const mockLoadAccountRepository = new MockLoadAccountRepository() as jest.Mocked<MockLoadAccountRepository>
  const sut = new DbAddAccount(mockHasher, mockAddAccountRepository, mockLoadAccountRepository)

  describe('Hasher', () => {
    test('Should call Hasher with correct password', async () => {
      const hashSpy = jest.spyOn(mockHasher, 'hash')
      await sut.add(fakeAccountParams)
      expect(hashSpy).toHaveBeenCalledWith(fakeAccountParams.password)
    })

    test('Should throw if Hasher throws', async () => {
      mockHasher.hash.mockRejectedValueOnce(new Error())
      const accountPromise = sut.add(fakeAccountParams)
      await expect(accountPromise).rejects.toThrow()
    })
  })

  describe('AddAccount Repository', () => {
    test('Should call AddAccountRepository with correct values', async () => {
      const addSpy = jest.spyOn(mockAddAccountRepository, 'add')
      await sut.add(fakeAccountParams)
      expect(addSpy).toHaveBeenCalledWith({ ...fakeAccountParams, password: 'hashed_password' })
    })

    test('Should throw if AddAccountRepository throws', async () => {
      mockAddAccountRepository.add.mockRejectedValueOnce(new Error())
      const accountPromise = sut.add(fakeAccountParams)
      await expect(accountPromise).rejects.toThrow()
    })

    test('Should return an account on success', async () => {
      const account = await sut.add(fakeAccountParams)
      expect(account).toEqual(fakeAccountModel)
    })
  })

  describe('LoadAccount Repository', () => {
    test('Should call LoadAccountRepository with correct email', async () => {
      const loadByEmailSpy = jest.spyOn(mockLoadAccountRepository, 'loadByEmail')
      await sut.add(fakeAccountParams)
      expect(loadByEmailSpy).toHaveBeenCalledWith(fakeAccountParams.email)
    })

    test('Should null if loadAccount not returns null', async () => {
      mockLoadAccountRepository.loadByEmail.mockResolvedValueOnce(fakeAccountModel)
      const account = await sut.add(fakeAccountParams)
      expect(account).toBeNull()
    })
  })
})
