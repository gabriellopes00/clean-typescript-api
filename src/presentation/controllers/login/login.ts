import { Controller, HttpRequest, HttpResponse } from '../../interfaces'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../interfaces/emailValidator'
import { Authenticator } from '@domain/usecases/authentication'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authenticator: Authenticator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const requiredFields = ['email', 'password']
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingParamError(requiredField))
        }
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return new Promise((resolve, reject) => {
          resolve(badRequest(new InvalidParamError('email')))
        })
      }

      const accessToken = await this.authenticator.authenticate(email, password)
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
