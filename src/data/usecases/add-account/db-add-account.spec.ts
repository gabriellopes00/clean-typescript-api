import { LoadAccountRepository } from '../../interfaces/db/account/load-account-repository'
import { DbAddAccount } from './db-add-account'
import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './db-add-account-interfaces'

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountRepositoryStub: LoadAccountRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'gabriel',
  email: 'gabrielluislopes00@gmail.com',
  password: 'hashed_password'
})
const makeFakeAccountData = (): AddAccountModel => ({
  name: 'gabriel',
  email: 'gabrielluislopes00@gmail.com',
  password: 'password1234'
})
const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve, reject) => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(values: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve, reject) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountRepositoryStub = (): LoadAccountRepository => {
  class LoadAccountRepositoryStub implements LoadAccountRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const account = makeFakeAccount()
      return new Promise((resolve, reject) => resolve(account))
    }
  }

  return new LoadAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountRepositoryStub = makeLoadAccountRepositoryStub()
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountRepositoryStub
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountRepositoryStub
  }
}

describe('DbAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = {
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: 'password1234'
    }
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith('password1234')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accountData = {
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: 'password1234'
    }
    const accountPromise = sut.add(accountData)
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accountPromise = sut.add(makeFakeAccountData())
    await expect(accountPromise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })

  // LoadAccountRepository tests
  test('Should call LoadAccountRepository with correct email', async () => {
    const { sut, loadAccountRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountRepositoryStub, 'loadByEmail')

    await sut.add(makeFakeAccountData())
    expect(loadByEmailSpy).toHaveBeenCalledWith('gabrielluislopes00@gmail.com')
  })
})
