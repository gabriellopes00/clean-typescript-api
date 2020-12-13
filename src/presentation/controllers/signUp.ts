import { HttpRequest, HttpResponse } from '../interfaces/http'
import { badRequest } from '../helpers/http'
import { MissingParamError } from '../errors/missing-param'
import { InvalidParamError } from '../errors/invalid-param'
import { Controller } from '@interfaces/controller'
import { EmailValidator } from '@interfaces/email-validator'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingParamError(requiredField))
      }
    }
    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValidEmail) return badRequest(new InvalidParamError('email'))
  }
}
