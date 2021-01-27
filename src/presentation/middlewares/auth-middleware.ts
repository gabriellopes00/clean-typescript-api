import { AccessDeniedError } from '@presentation/errors/access-denied'
import { HttpRequest, HttpResponse } from '@presentation/interfaces'
import { Middleware } from '../interfaces/middleware'
import { forbidden } from '../helpers/http/http'

export class AuthMiddleware implements Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = forbidden(new AccessDeniedError())
    return new Promise(resolve => resolve(error))
  }
}
