import { AccessDeniedError } from '@presentation/errors/access-denied'
import { HttpRequest, HttpResponse } from '@presentation/interfaces'
import { Middleware } from '../interfaces/middleware'
import { forbidden, ok, serverError } from '../helpers/http/http'
import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    console.log(httpRequest)
    try {
      if (!httpRequest.headers) return forbidden(new AccessDeniedError())
      const accessToken =
        httpRequest.headers?.accessToken || httpRequest.headers['access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        )
        if (account) {
          return ok({ accountId: account.id })
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
