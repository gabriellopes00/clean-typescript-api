import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

describe('Bcrypt Adapter', () => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  describe('Hash', () => {
    test('Should call hash with correct values', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('value')
      expect(hashSpy).toHaveBeenLastCalledWith('value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const hash = await sut.hash('value')
      expect(hash).toBe('hash')
    })

    test('Should throw if hash throws', async () => {
      jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
      const hashPromise = sut.hash('value')
      await expect(hashPromise).rejects.toThrow()
    })
  })

  describe('Hash Comparer', () => {
    test('Should call compare with correct values', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenLastCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if compre throws', async () => {
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error())
      const isValid = sut.compare('any_value', 'any_hash')
      await expect(isValid).rejects.toThrow()
    })
  })
})
