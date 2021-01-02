import { Controller, HttpRequest, HttpResponse } from '../../interfaces'
import { badRequest } from '../../helpers/http'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise((resolve, reject) => {
        resolve(badRequest(new MissingParamError('email')))
      })
    }
    if (!httpRequest.body.password) {
      return new Promise((resolve, reject) => {
        resolve(badRequest(new MissingParamError('password')))
      })
    }
  }
}
