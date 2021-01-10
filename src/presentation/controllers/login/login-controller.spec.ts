import { LoginController } from './login-controller'
import { MissingParamError } from '../../errors'
import { HttpRequest } from '../../interfaces/http'
import { Validation } from '../../interfaces/validation'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../helpers/http/http'
import {
  AuthenticationModel,
  Authenticator
} from '@domain/usecases/authentication'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async authenticate(data: AuthenticationModel): Promise<string> {
      return new Promise((resolve, reject) => resolve('access_token'))
    }
  }

  return new AuthenticatorStub()
}

interface SutTypes {
  sut: LoginController
  authenticatorStub: Authenticator
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticatorStub = makeAuthenticator()
  const sut = new LoginController(validationStub, authenticatorStub)
  return { sut, authenticatorStub, validationStub }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'gabriel@example.com',
      password: 'gabriel123'
    }
  }
}

describe('Login Controller', () => {
  // Authentication
  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authenticateSpy = jest.spyOn(authenticatorStub, 'authenticate')

    await sut.handle(makeFakeRequest())
    expect(authenticateSpy).toHaveBeenCalledWith({
      email: 'gabriel@example.com',
      password: 'gabriel123'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'authenticate').mockReturnValueOnce(null)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authenticators throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest
      .spyOn(authenticatorStub, 'authenticate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'access_token' }))
  })

  // Composite Pattern tests (Validation)
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an Error', async () => {
    const { sut, validationStub } = makeSut()
    // could be any error (below)
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
