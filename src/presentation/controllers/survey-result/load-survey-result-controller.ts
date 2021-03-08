import { LoadSurveyById } from '@domain/usecases/load-survey'
import { Controller, HttpRequest, HttpResponse } from '@presentation/interfaces'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(request.params.surveyId)
    return null
  }
}
