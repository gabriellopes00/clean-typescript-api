import { Decrypter } from '../../../data/interfaces/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenRepository } from '../../interfaces/db/account/load-account-by-token-repository'

class DecrypterStub implements Decrypter {
  async decript(value: string): Promise<string> {
    return 'any_token'
  }
}

class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    return {
      id: 'any_id',
      name: 'gabriel',
      email: 'gabriel@mail.com',
      password: 'hashed_password'
    }
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  const decrypterStub = new DecrypterStub()
  const loadAccountByTokenRepository = new LoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepository
  )

  test('Should call decrypter with correct values', async () => {
    const decryptSpy = jest.spyOn(decrypterStub, 'decript')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenLastCalledWith('any_token')
  })

  test('Should return null if decrypter returns null', async () => {
    jest.spyOn(decrypterStub, 'decript').mockReturnValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const loadSpy = jest.spyOn(loadAccountByTokenRepository, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadSpy).toHaveBeenLastCalledWith('any_token', 'any_role')
  })

  test('Should return null if loadAccountRepository returns null', async () => {
    jest
      .spyOn(loadAccountByTokenRepository, 'loadByToken')
      .mockReturnValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return null if loadAccountRepository returns null', async () => {
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual({
      id: 'any_id',
      name: 'gabriel',
      email: 'gabriel@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if Decrypter throws', async () => {
    jest
      .spyOn(decrypterStub, 'decript')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    jest
      .spyOn(loadAccountByTokenRepository, 'loadByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
