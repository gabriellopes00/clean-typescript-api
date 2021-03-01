import { LoadSurveyById } from '@domain/usecases/load-survey'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpRequest, HttpResponse } from '../../interfaces/'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
