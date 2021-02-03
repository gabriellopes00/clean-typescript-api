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
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenLastCalledWith('any_token')
  })

  test('Should return null if decrypter returns null', async () => {
    jest.spyOn(decrypterStub, 'decript').mockReturnValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
