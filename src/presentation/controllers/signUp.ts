import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http'

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']
    for (const requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingParamError(requiredField))
      }
    }
  }
}
