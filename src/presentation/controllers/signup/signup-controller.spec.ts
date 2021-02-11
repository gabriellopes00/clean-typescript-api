import { SignUpController } from './signup-controller'
import { ok, serverError, badRequest, forbidden } from '../../helpers/http/http'
import {
  MissingParamError,
  ServerError,
  EmailAlreadyInUseError
} from '../../../presentation/errors/index'
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation
} from './signup-controller-interfaces'
import {
  AuthenticationModel,
  Authenticator
} from '../../../domain/usecases/authentication'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticatorStub: Authenticator
}

const makeFakeRequest = (): HttpRequest<AddAccountModel> => ({
  body: {
    name: 'gabriel',
    email: 'gabriel@example.com',
    password: 'gabriel123'
  }
})
const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email',
  password: 'valid-password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

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

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticatorStub = makeAuthenticator()

  const sut = new SignUpController(
    validationStub,
    addAccountStub,
    authenticatorStub
  )
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticatorStub
  }
}

describe('SingUp Controller', () => {
  // AddAccount integration tests
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'gabriel',
      email: 'gabriel@example.com',
      password: 'gabriel123'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
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

  // 403
  test('Should return 403 if addAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest
      .spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new EmailAlreadyInUseError()))
  })
})
