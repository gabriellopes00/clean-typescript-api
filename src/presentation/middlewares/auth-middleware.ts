import { AccessDeniedError } from '@presentation/errors/access-denied'
import { HttpRequest, HttpResponse } from '@presentation/interfaces'
import { Middleware } from '../interfaces/middleware'
import { forbidden, ok } from '../helpers/http/http'
import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.accessToken
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        return ok({ accountId: account.id })
      }
    }

    const error = forbidden(new AccessDeniedError())
    return error
  }
}
