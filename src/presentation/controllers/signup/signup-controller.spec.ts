import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountParams } from '../../../domain/usecases/add-account'
import { AuthenticationParams, Authenticator } from '../../../domain/usecases/authentication'
import {
  fakeAccountModel,
  fakeAccountParams,
  fakeHttpRequest
} from '../../../domain/mocks/mock-account'
import {
  EmailAlreadyInUseError,
  MissingParamError,
  ServerError
} from '../../../presentation/errors/index'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/http'
import { Validation } from '../../interfaces/validation'
import { SignUpController } from './signup-controller'

class MockAddAccount implements AddAccount {
  async add(account: AddAccountParams): Promise<AccountModel> {
    return new Promise(resolve => resolve(fakeAccountModel))
  }
}

class MockValidation implements Validation {
  validate(input: any): Error {
    return null
  }
}

class MockAuthenticator implements Authenticator {
  async authenticate(data: AuthenticationParams): Promise<string> {
    return new Promise(resolve => resolve('access_token'))
  }
}

describe('SingUp Controller', () => {
  const mockValidation = new MockValidation() as jest.Mocked<MockValidation>
  const mockAddAccount = new MockAddAccount() as jest.Mocked<MockAddAccount>
  const mockAuthenticator = new MockAuthenticator() as jest.Mocked<MockAuthenticator>
  const sut = new SignUpController(mockValidation, mockAddAccount, mockAuthenticator)

  describe('AddAccount', () => {
    test('Should call AddAccount with correct values', async () => {
      const addSpy = jest.spyOn(mockAddAccount, 'add')
      await sut.handle(fakeHttpRequest)
      expect(addSpy).toHaveBeenCalledWith({ ...fakeAccountParams })
    })

    test('Should return 500 if AddAccount throws', async () => {
      mockAddAccount.add.mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(fakeHttpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('Should return 200 if valid data is provided', async () => {
      const httpResponse = await sut.handle(fakeHttpRequest)
      expect(httpResponse).toEqual(ok({ accessToken: 'access_token' }))
    })

    test('Should return 403 if addAccount returns null', async () => {
      mockAddAccount.add.mockResolvedValueOnce(null)
      const httpResponse = await sut.handle(fakeHttpRequest)
      expect(httpResponse).toEqual(forbidden(new EmailAlreadyInUseError()))
    })
  })

  describe('Validations', () => {
    test('Should call Validation with correct values', async () => {
      const validateSpy = jest.spyOn(mockValidation, 'validate')
      const httpRequest = fakeHttpRequest
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation returns an Error', async () => {
      // could be any error (below)
      mockValidation.validate.mockReturnValueOnce(new MissingParamError('any_field'))
      const httpResponse = await sut.handle(fakeHttpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
  })

  describe('Authentication', () => {
    test('Should call Authenticator with correct values', async () => {
      const authenticateSpy = jest.spyOn(mockAuthenticator, 'authenticate')
      await sut.handle(fakeHttpRequest)
      expect(authenticateSpy).toHaveBeenCalledWith({
        email: fakeAccountParams.email,
        password: fakeAccountParams.password
      })
    })

    test('Should return 500 if Authenticators throws', async () => {
      mockAuthenticator.authenticate.mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(fakeHttpRequest)
      expect(httpResponse).toEqual(serverError(new Error()))
    })
  })
})
