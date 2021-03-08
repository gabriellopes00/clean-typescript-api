import { LoadSurveyById } from '@domain/usecases/load-survey'
import { forbidden } from '@presentation/helpers/http/http'
import { InvalidParamError } from '@presentation/errors'
import { Controller, HttpRequest, HttpResponse } from '@presentation/interfaces'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(request.params.surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return null
  }
}
