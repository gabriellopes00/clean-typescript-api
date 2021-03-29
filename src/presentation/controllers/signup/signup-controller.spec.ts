import { fakeAccountModel, fakeAccountParams } from '../../../domain/mocks/mock-account'
import { AccountModel, AuthenticationModel } from '../../../domain/models/account'
import { AddAccount, AddAccountParams } from '../../../domain/usecases/add-account'
import { AuthenticationParams, Authenticator } from '../../../domain/usecases/authentication'
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
  async authenticate(data: AuthenticationParams): Promise<AuthenticationModel> {
    return new Promise(resolve => resolve({ accessToken: 'access_token', name: 'any_name' }))
  }
}

export const fakeRequest: SignUpController.Request = {
  name: fakeAccountParams.name,
  email: fakeAccountParams.email,
  password: fakeAccountParams.password,
  passwordConfirmation: 'any_password'
}

describe('SingUp Controller', () => {
  const mockValidation = new MockValidation() as jest.Mocked<MockValidation>
  const mockAddAccount = new MockAddAccount() as jest.Mocked<MockAddAccount>
  const mockAuthenticator = new MockAuthenticator() as jest.Mocked<MockAuthenticator>
  const sut = new SignUpController(mockValidation, mockAddAccount, mockAuthenticator)

  describe('AddAccount', () => {
    test('Should call AddAccount with correct values', async () => {
      const addSpy = jest.spyOn(mockAddAccount, 'add')
      await sut.handle(fakeRequest)
      expect(addSpy).toHaveBeenCalledWith({ ...fakeAccountParams })
    })

    test('Should return 500 if AddAccount throws', async () => {
      mockAddAccount.add.mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('Should return 200 if valid data is provided', async () => {
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(ok({ accessToken: 'access_token', name: 'any_name' }))
    })

    test('Should return 403 if addAccount returns null', async () => {
      mockAddAccount.add.mockResolvedValueOnce(null)
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(forbidden(new EmailAlreadyInUseError()))
    })
  })

  describe('Validations', () => {
    test('Should call Validation with correct values', async () => {
      const validateSpy = jest.spyOn(mockValidation, 'validate')
      const httpRequest = fakeRequest
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Should return 400 if Validation returns an Error', async () => {
      // could be any error (below)
      mockValidation.validate.mockReturnValueOnce(new MissingParamError('any_field'))
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
  })

  describe('Authentication', () => {
    test('Should call Authenticator with correct values', async () => {
      const authenticateSpy = jest.spyOn(mockAuthenticator, 'authenticate')
      await sut.handle(fakeRequest)
      expect(authenticateSpy).toHaveBeenCalledWith({
        email: fakeAccountParams.email,
        password: fakeAccountParams.password
      })
    })

    test('Should return 500 if Authenticators throws', async () => {
      mockAuthenticator.authenticate.mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(serverError(new Error()))
    })
  })
})
