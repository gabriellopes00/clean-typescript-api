import { Controller, HttpRequest, HttpResponse } from '../../interfaces'
import { badRequest, serverError } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../interfaces/emailValidator'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return new Promise((resolve, reject) => {
          resolve(badRequest(new MissingParamError('email')))
        })
      }
      if (!password) {
        return new Promise((resolve, reject) => {
          resolve(badRequest(new MissingParamError('password')))
        })
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return new Promise((resolve, reject) => {
          resolve(badRequest(new InvalidParamError('email')))
        })
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
