import { Decrypter } from '@data/interfaces/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

class DecrypterStub implements Decrypter {
  async decript(value: string): Promise<string> {
    return 'any_value'
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  const decrypterStub = new DecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)

  test('Should call decrypter with correct values', async () => {
    const decryptSpy = jest.spyOn(decrypterStub, 'decript')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenLastCalledWith('any_token')
  })
})
