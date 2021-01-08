import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve, reject) => resolve('hash'))
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve, reject) => resolve(true))
  }
}))

interface SutTypes {
  sut: BcryptAdapter
}

const salt = 12

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt)
  return { sut }
}

describe('Bcrypt Adapter', () => {
  // Hash method
  test('Should call hash with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('value')
    expect(hashSpy).toHaveBeenLastCalledWith('value', salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('value')
    expect(hash).toBe('hash')
  })

  test('Should throw if hash throws', async () => {
    const { sut } = makeSut()
    jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const hashPromise = sut.hash('value')
    await expect(hashPromise).rejects.toThrow()
  })

  // Hash-comparer method
  test('Should call compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenLastCalledWith('any_value', 'any_hash')
  })

  test('Should return true when compare succeeds', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('Should return false when compare fails', async () => {
    const { sut } = makeSut()
    jest
      .spyOn(bcrypt, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)))

    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('Should throw if compre throws', async () => {
    const { sut } = makeSut()
    jest
      .spyOn(bcrypt, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const isValid = sut.compare('any_value', 'any_hash')
    await expect(isValid).rejects.toThrow()
  })
})
