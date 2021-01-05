import { badRequest, serverError, ok } from '@presentation/helpers/http/http'
import { AddAccount, AddAccountModel } from '@domain/usecases/add-account'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-interfaces'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async handle(
    httpRequest: HttpRequest<AddAccountModel>
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, name, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
