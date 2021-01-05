import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '../../helpers/http/http'
import {
  AuthenticationModel,
  Authenticator
} from '@domain/usecases/authentication'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../interfaces'

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authenticator: Authenticator
  ) {}

  async handle(
    httpRequest: HttpRequest<AuthenticationModel>
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const accessToken = await this.authenticator.authenticate(
        httpRequest.body
      )
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
