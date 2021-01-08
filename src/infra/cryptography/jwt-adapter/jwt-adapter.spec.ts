import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve, reject) => resolve('any_token'))
  }
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('secret')
  return sut
}

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })

  test('Should return a token on sign success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt('any_value')
    expect(token).toBe('any_token')
  })

  test('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const errorPromise = sut.encrypt('any_value')
    await expect(errorPromise).rejects.toThrow()
  })
})
