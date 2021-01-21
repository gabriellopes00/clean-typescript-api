import { badRequest, serverError, ok } from '@presentation/helpers/http/http'
import { AddAccount, AddAccountModel } from '@domain/usecases/add-account'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-controller-interfaces'
import { Authenticator } from '@domain/usecases/authentication'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authenticator
  ) {}

  async handle(
    httpRequest: HttpRequest<AddAccountModel>
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, name, password } = httpRequest.body
      await this.addAccount.add({ name, email, password })
      const token = await this.authentication.authenticate({ email, password })

      return ok({ accessToken: token })
    } catch (error) {
      return serverError(error)
    }
  }
}
