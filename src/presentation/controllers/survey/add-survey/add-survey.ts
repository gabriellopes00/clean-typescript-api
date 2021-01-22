import { AddSurvey, AddSurveyModel } from '@domain/usecases/add-survey'
import { badRequest } from '@presentation/helpers/http/http'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@presentation/interfaces'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(
    httpRequest: HttpRequest<AddSurveyModel>
  ): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)

    await this.addSurvey.add({
      question: httpRequest.body.question,
      answers: httpRequest.body.answers
    })
    return null
  }
}