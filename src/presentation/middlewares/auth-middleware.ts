import { AccessDeniedError } from '@presentation/errors/access-denied'
import { HttpResponse } from '@presentation/interfaces'
import { Middleware } from '../interfaces/middleware'
import { forbidden, ok, serverError } from '../helpers/http/http'
import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      if (!request.accessToken) return forbidden(new AccessDeniedError())
      const { accessToken } = request

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) return ok({ accountId: account.id })
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AuthMiddleware {
  export interface Request {
    accessToken?: string
  }
}
