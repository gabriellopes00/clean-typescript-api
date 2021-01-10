import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../add-account/db-add-account-interfaces'
import { AuthenticationModel } from '@domain/usecases/authentication'
import { LoadAccountRepository } from '../../interfaces/db/account/load-account-repository'
import { HashComparer } from '../../interfaces/cryptography/hash-comparer'
import { Encrypter } from '../../interfaces/cryptography/encrypter'
import { AccessTokenRepository } from '../../interfaces/db/account/access-token-repository'

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
    async loadByEmail(email: string): Promise<AccountModel> {
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

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve, reject) => resolve('any_token'))
    }
  }

  return new EncrypterStub()
}

const makeAccessTokenRepositoryStub = (): AccessTokenRepository => {
  class AccessTokenRepositoryStub implements AccessTokenRepository {
    async storeAccessToken(id: string, token: string): Promise<void> {
      return new Promise((resolve, reject) => resolve())
    }
  }

  return new AccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountRepositoryStub: LoadAccountRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  accessTokenRepositoryStub: AccessTokenRepository
}
const makeSut = (): SutTypes => {
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const accessTokenRepositoryStub = makeAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountRepositoryStub,
    hashComparerStub,
    encrypterStub,
    accessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountRepositoryStub,
    hashComparerStub,
    encrypterStub,
    accessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  // LoadAccountRepository tests
  test('Should call LoadAccountRepository with correct email', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountRepositoryStub, 'loadByEmail')

    await sut.authenticate(makeFakeAuthentication())
    expect(loadByEmailSpy).toHaveBeenCalledWith(makeFakeAuthentication().email)
  })

  test('Should throw if LoadAccountRepository throws', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })

  test('Should return null if LoadAccountRepository returns null', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)

    const accessToken = await sut.authenticate(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  // HashComparer tests
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

  // Encrypter tests
  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.authenticate(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.authenticate(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  // AccessToken repository tests
  test('Should call AccessTokenRepository with correct values', async () => {
    const { sut, accessTokenRepositoryStub } = makeSut()
    const storeAccessTokenSpy = jest.spyOn(
      accessTokenRepositoryStub,
      'storeAccessToken'
    )

    await sut.authenticate(makeFakeAuthentication())
    expect(storeAccessTokenSpy).toHaveBeenCalledWith(
      makeFakeAccount().id,
      'any_token'
    )
  })

  test('Should throw if AccessTokenRepository throws', async () => {
    const { sut, accessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(accessTokenRepositoryStub, 'storeAccessToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })
})
