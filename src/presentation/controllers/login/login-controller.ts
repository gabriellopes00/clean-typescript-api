import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http'
import { AuthenticationParams, Authenticator } from '@domain/usecases/authentication'
import { Controller, HttpRequest, HttpResponse, Validation } from '../../interfaces'

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authenticator: Authenticator
  ) {}

  async handle(httpRequest: HttpRequest<AuthenticationParams>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const authModel = await this.authenticator.authenticate(httpRequest.body)
      if (!authModel) return unauthorized()

      return ok(authModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
