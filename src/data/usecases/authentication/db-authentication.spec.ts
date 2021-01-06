import { AccountModel } from '../add-account/db-add-account-interfaces'
import { LoadAccountRepository } from '../../interfaces/db/load-account-repository'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '@domain/usecases/authentication'
import { HashComparer } from '../../interfaces/cryptography/hash-comparer'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'test@example.com',
  password: 'test123'
})

const makeLoadAccountRepositoryStub = (): LoadAccountRepository => {
  class LoadAccountRepositoryStub implements LoadAccountRepository {
    async load(email: string): Promise<AccountModel> {
      const account = makeFakeAccount()
      return new Promise((resolve, reject) => resolve(account))
    }
  }

  return new LoadAccountRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve, reject) => resolve(true))
    }
  }

  return new HashComparerStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountRepositoryStub: LoadAccountRepository
  hashComparerStub: HashComparer
}
const makeSut = (): SutTypes => {
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const sut = new DbAuthentication(loadAccountRepositoryStub, hashComparerStub)
  return { sut, loadAccountRepositoryStub, hashComparerStub }
}

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, 'load')

    await sut.authenticate(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthentication().email)
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

  test('Should return null if LoadAccountRepository returns null', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    jest.spyOn(loadAccountRepositoryStub, 'load').mockReturnValueOnce(null)

    const accessToken = await sut.authenticate(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.authenticate(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith(
      makeFakeAuthentication().password,
      makeFakeAccount().password
    )
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)))

    const accessToken = await sut.authenticate(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })
})
