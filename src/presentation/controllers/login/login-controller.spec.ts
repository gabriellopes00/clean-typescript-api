import { fakeLoginParams } from '../../../domain/mocks/mock-account'
import { AuthenticationParams, Authenticator } from '../../../domain/usecases/authentication'
import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http'
import { HttpRequest } from '../../interfaces/http'
import { Validation } from '../../interfaces/validation'
import { LoginController } from './login-controller'

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

export const fakeRequest: HttpRequest = { body: { ...fakeLoginParams } }

describe('Login Controller', () => {
  const mockValidation = new MockValidation() as jest.Mocked<MockValidation>
  const mockAuthenticator = new MockAuthenticator() as jest.Mocked<MockAuthenticator>
  const sut = new LoginController(mockValidation, mockAuthenticator)

  describe('Authentication', () => {
    test('Should call Authenticator with correct values', async () => {
      const authenticateSpy = jest.spyOn(mockAuthenticator, 'authenticate')
      await sut.handle(fakeRequest)
      expect(authenticateSpy).toHaveBeenCalledWith({ ...fakeLoginParams })
    })

    test('Should return 401 if invalid credentials are provided', async () => {
      mockAuthenticator.authenticate.mockReturnValueOnce(null)
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Authenticators throws', async () => {
      mockAuthenticator.authenticate.mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 if valid credentials are provided', async () => {
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(ok({ accessToken: 'access_token' }))
    })
  })

  describe('Validation', () => {
    test('Should call Validation with correct values', async () => {
      const validateSpy = jest.spyOn(mockValidation, 'validate')
      const httpRequest = fakeRequest
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation returns an Error', async () => {
      // could be any error (below)
      mockValidation.validate.mockReturnValueOnce(new MissingParamError('any_field'))
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
  })
})
