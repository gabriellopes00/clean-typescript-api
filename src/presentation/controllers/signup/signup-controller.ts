import { badRequest, serverError, ok, forbidden } from '@presentation/helpers/http/http'
import { AddAccount, AddAccountParams } from '@domain/usecases/add-account'
import { Authenticator } from '@domain/usecases/authentication'
import { EmailAlreadyInUseError } from '@presentation/errors'
import { Controller, Validation, HttpRequest, HttpResponse } from '@presentation/interfaces'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authenticator
  ) {}

  async handle(httpRequest: HttpRequest<AddAccountParams>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, name, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      if (!account) return forbidden(new EmailAlreadyInUseError())
      const authModel = await this.authentication.authenticate({ email, password })

      return ok(authModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
