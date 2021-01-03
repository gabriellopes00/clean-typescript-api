import { badRequest, serverError, ok } from '@presHelpers/http'
import { InvalidParamError } from '@presErrors/index'
import { AddAccount } from '@domUsecases/addAccount'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation
} from './signupInterfaces'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly validation: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, name, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
