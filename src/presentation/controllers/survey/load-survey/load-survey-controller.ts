import { LoadSurvey } from '@domain/usecases/load-survey'
import { noContent, ok, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpRequest, HttpResponse } from '@presentation/interfaces'

export class LoadSurveyController implements Controller {
  constructor(private readonly loadSurvey: LoadSurvey) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load(httpRequest.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
