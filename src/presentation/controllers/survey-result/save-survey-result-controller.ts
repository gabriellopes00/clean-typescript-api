import { LoadSurveyById } from '@domain/usecases/load-survey'
import { SaveSurveyResults } from '@domain/usecases/save-survey-results'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, ok, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpRequest, HttpResponse } from '../../interfaces/'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResults
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })
      return ok(surveyResult)
    } catch (error) {
      console.log(error)
      return serverError(error) // λ
    }
  }
}
