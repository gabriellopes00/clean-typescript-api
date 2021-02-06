import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve, reject) => resolve('any_token'))
  },

  async verify(): Promise<string> {
    return new Promise((resolve, reject) => resolve('any_value'))
  }
}))

describe('Jwt Adapter', () => {
  const sut = new JwtAdapter('secret')

  describe('Encrypter', () => {
    test('Should call sign with correct values', async () => {
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_value')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const token = await sut.encrypt('any_value')
      expect(token).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const errorPromise = sut.encrypt('any_value')
      await expect(errorPromise).rejects.toThrow()
    })
  })

  describe('Decrypter', () => {
    test('Should call verify with correct values', async () => {
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decript('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const value = await sut.decript('any_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if verify throws', async () => {
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const errorPromise = sut.decript('any_token')
      await expect(errorPromise).rejects.toThrow()
    })
  })
})
