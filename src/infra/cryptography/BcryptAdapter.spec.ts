import bcrypt from 'bcrypt'
import { BcryptAdapter } from './BcryptAdapter'

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

    await sut.encrypt('value')
    expect(hashSpy).toHaveBeenLastCalledWith('value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('value')
    expect(hash).toBe('hash')
  })
})
