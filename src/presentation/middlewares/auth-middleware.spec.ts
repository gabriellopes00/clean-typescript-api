import { forbidden } from '../helpers/http/http'
import { AccessDeniedError } from '../errors/access-denied'
import { AuthMiddleware } from './auth-middleware'

const makeSut = () => {
  const sut = new AuthMiddleware()
  return { sut }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no accessToken exists in request header', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
