import { badRequest, serverError, ok, forbidden } from '@presentation/helpers/http/http'
import { AddAccount } from '@domain/usecases/add-account'
import { Authenticator } from '@domain/usecases/authentication'
import { EmailAlreadyInUseError } from '@presentation/errors'
import { Controller, Validation, HttpResponse } from '@presentation/interfaces'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authenticator
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { email, name, password } = request
      const account = await this.addAccount.add({ name, email, password })
      if (!account) return forbidden(new EmailAlreadyInUseError())
      const authModel = await this.authentication.authenticate({ email, password })

      return ok(authModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export interface Request {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
