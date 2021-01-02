import { LoginController } from './login'
import { badRequest, serverError } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../interfaces/emailValidator'
import { HttpRequest } from '../../interfaces/http'
import { Authenticator } from '@domain/usecases/authentication'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async authenticate(email: string, password: string): Promise<string> {
      return new Promise((resolve, reject) => resolve('token'))
    }
  }

  return new AuthenticatorStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticatorStub: Authenticator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticatorStub = makeAuthenticator()
  const sut = new LoginController(emailValidatorStub, authenticatorStub)
  return { sut, emailValidatorStub, authenticatorStub }
}

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'gabriel@example.com',
      password: 'gabriel123'
    }
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { password: 'gabriel1234' }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'gabriel@example.com' }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('gabriel@example.com')
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  // Authentication
  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authenticateSpy = jest.spyOn(authenticatorStub, 'authenticate')

    await sut.handle(makeFakeHttpRequest())
    expect(authenticateSpy).toHaveBeenCalledWith(
      'gabriel@example.com',
      'gabriel123'
    )
  })
})
