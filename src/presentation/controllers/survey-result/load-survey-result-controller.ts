import { LoadSurveyById } from '@domain/usecases/load-survey'
import { forbidden, ok, serverError } from '@presentation/helpers/http/http'
import { InvalidParamError } from '@presentation/errors'
import { Controller, HttpResponse } from '@presentation/interfaces'
import { LoadSurveyResult } from '@domain/usecases/load-survey-results'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId } = request
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const surveyResult = await this.loadSurveyResult.load(surveyId, request.accountId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyResultController {
  export interface Request {
    surveyId: string
    accountId: string
  }
}
