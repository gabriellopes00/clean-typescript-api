import { badRequest, serverError, ok } from '../../helpers/http'
import { MissingParamError, InvalidParamError } from '../../errors/index'
import { AddAccount } from '@usecases/addAccount'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from './signupInterfaces'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password']
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingParamError(requiredField))
        }
      }

      const { email, name, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
