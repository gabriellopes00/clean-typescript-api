import { badRequest, serverError } from '../../helpers/http'
import { MissingParamError, InvalidParamError } from '../../errors/index'
import { AddAccount } from '@usecases/add-account'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from './signup-interfaces'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private addAccount: AddAccount
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
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

      const account = this.addAccount.add({ name, email, password })
      return {
        statusCode: 200,
        body: account
      }
    } catch {
      return serverError()
    }
  }
}
