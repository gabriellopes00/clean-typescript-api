import { AccountModel } from '../add-account/db-add-account-interfaces'
import { LoadAccountRepository } from '../../interfaces/load-account-repository'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '@domain/usecases/authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'test@example.com',
  password: 'test123'
})

const makeLoadAccountRepositoryStub = () => {
  class LoadAccountRepositoryStub implements LoadAccountRepository {
    async load(email: string): Promise<AccountModel> {
      const account = makeFakeAccount()
      return new Promise((resolve, reject) => resolve(account))
    }
  }

  return new LoadAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountRepositoryStub: LoadAccountRepository
}
const makeSut = (): SutTypes => {
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const sut = new DbAuthentication(loadAccountRepositoryStub)
  return { sut, loadAccountRepositoryStub }
}

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, 'load')

    await sut.authenticate(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('test@example.com')
  })

  test('Should throw if LoadAccountByEmail throws', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })
})
