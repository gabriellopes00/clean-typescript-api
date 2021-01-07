import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve, reject) => resolve('hash'))
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
  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('value')
    expect(hashSpy).toHaveBeenLastCalledWith('value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('value')
    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const { sut } = makeSut()
    jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const hashPromise = sut.hash('value')
    await expect(hashPromise).rejects.toThrow()
  })
})
