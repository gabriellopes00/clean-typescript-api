import { LoginController } from './login'
import { badRequest } from '../../helpers/http'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: LoginController
}
const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {
  test('Should return 400 if o email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { password: 'gabriel1234' }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if o password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'gabriel@example.com' }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
