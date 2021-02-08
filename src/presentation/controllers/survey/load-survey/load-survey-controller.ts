import { LoadSurvey } from '@domain/usecases/load-survey'
import { ok, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpRequest, HttpResponse } from '@presentation/interfaces'

export class LoadSurveyController implements Controller {
  constructor(private readonly loadSurvey: LoadSurvey) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
