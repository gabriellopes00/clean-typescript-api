import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http'
import { Authenticator } from '@domain/usecases/authentication'
import { Controller, HttpResponse, Validation } from '../../interfaces'

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authenticator: Authenticator
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const authModel = await this.authenticator.authenticate(request)
      if (!authModel) return unauthorized()

      return ok(authModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoginController {
  export interface Request {
    email: string
    password: string
  }
}
