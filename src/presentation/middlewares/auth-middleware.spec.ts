import { fakeAccountModel } from '../../domain/mocks/mock-account'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied'
import { forbidden, ok, serverError } from '../helpers/http/http'
import { AuthMiddleware } from './auth-middleware'

const fakeRequest: AuthMiddleware.Request = { accessToken: 'any_token' }

class MockLoadAccountByToken implements LoadAccountByToken {
  load(accessToken: string): Promise<AccountModel> {
    return new Promise(resolve => resolve(fakeAccountModel))
  }
}

describe('Auth Middleware', () => {
  const mockLoadAccountByToken = new MockLoadAccountByToken() as jest.Mocked<MockLoadAccountByToken>
  const role = 'any_role'
  const sut = new AuthMiddleware(mockLoadAccountByToken, role)

  test('Should return 403 if no accessToken exists in request header', async () => {
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const loadSpy = jest.spyOn(mockLoadAccountByToken, 'load')
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.accessToken, role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    mockLoadAccountByToken.load.mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    mockLoadAccountByToken.load.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
