import { badRequest, serverError } from '../helpers/http'
import { MissingParamError, InvalidParamError } from '../errors/index'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '@interfaces/index'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password']
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingParamError(requiredField))
        }
      }
      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))
    } catch {
      return serverError()
    }
  }
}
