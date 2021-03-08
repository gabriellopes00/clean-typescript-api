import { LoadSurveyById } from '@domain/usecases/load-survey'
import { forbidden, serverError } from '@presentation/helpers/http/http'
import { InvalidParamError } from '@presentation/errors'
import { Controller, HttpRequest, HttpResponse } from '@presentation/interfaces'
import { LoadSurveyResult } from '@domain/usecases/load-survey-results'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = request.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      await this.loadSurveyResult.load(surveyId)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
