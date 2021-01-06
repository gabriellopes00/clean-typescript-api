import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../add-account/db-add-account-interfaces'
import { AuthenticationModel } from '@domain/usecases/authentication'
import { LoadAccountRepository } from '../../interfaces/db/load-account-repository'
import { HashComparer } from '../../interfaces/cryptography/hash-comparer'
import { TokenGenerator } from '../../interfaces/cryptography/token-generator'
import { AccessTokenRepository } from '../../interfaces/db/access-token-repository'

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

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve, reject) => resolve('any_token'))
    }
  }

  return new TokenGeneratorStub()
}

const makeAccessTokenRepositoryStub = (): AccessTokenRepository => {
  class AccessTokenRepositoryStub implements AccessTokenRepository {
    async store(id: string, token: string): Promise<void> {
      return new Promise((resolve, reject) => resolve())
    }
  }

  return new AccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountRepositoryStub: LoadAccountRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  accessTokenRepositoryStub: AccessTokenRepository
}
const makeSut = (): SutTypes => {
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const accessTokenRepositoryStub = makeAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    accessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    accessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  // LoadAccountRepository tests
  test('Should call LoadAccountRepository with correct email', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, 'load')

    await sut.authenticate(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthentication().email)
  })

  test('Should throw if LoadAccountRepository throws', async () => {
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

  // TokenGenerator tests
  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.authenticate(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.authenticate(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  // AccessToken repository
  test('Should call AccessTokenRepository with correct values', async () => {
    const { sut, accessTokenRepositoryStub } = makeSut()
    const storeSpy = jest.spyOn(accessTokenRepositoryStub, 'store')

    await sut.authenticate(makeFakeAuthentication())
    expect(storeSpy).toHaveBeenCalledWith(makeFakeAccount().id, 'any_token')
  })

  test('Should throw if AccessTokenGenerator throws', async () => {
    const { sut, accessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(accessTokenRepositoryStub, 'store')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })
  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promiseError = sut.authenticate(makeFakeAuthentication())
    await expect(promiseError).rejects.toThrow()
  })
})
