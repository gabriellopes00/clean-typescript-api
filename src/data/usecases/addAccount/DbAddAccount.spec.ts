import { DbAddAccount } from './DbAddAccount'
import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './DbAddAccountInterfaces'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve, reject) => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(values: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'gabriel',
        email: 'gabrielluislopes00@gmail.com',
        password: 'hashed_password'
      }
      return new Promise((resolve, reject) => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DbAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: 'password1234'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('password1234')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
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
    const accountData = {
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: 'password1234'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: 'hashed_password'
    })
  })
})
