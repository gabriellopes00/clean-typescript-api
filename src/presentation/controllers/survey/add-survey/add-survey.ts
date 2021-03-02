import { AddSurvey, AddSurveyParams } from '@domain/usecases/add-survey'
import { badRequest, noContent, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpRequest, HttpResponse, Validation } from '@presentation/interfaces'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation, private readonly addSurvey: AddSurvey) {}

  async handle(httpRequest: HttpRequest<AddSurveyParams>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      await this.addSurvey.add({
        date: new Date(),
        question: httpRequest.body.question,
        answers: httpRequest.body.answers
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
