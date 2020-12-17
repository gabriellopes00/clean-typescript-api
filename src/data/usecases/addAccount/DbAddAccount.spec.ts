import { DbAddAccount } from './DbAddAccount'

describe('DbAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      encrypt(value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: 'password1234'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('password1234')
  })
})
