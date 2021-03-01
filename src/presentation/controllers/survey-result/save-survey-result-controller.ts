import { LoadSurveyById } from '@domain/usecases/load-survey'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpRequest, HttpResponse } from '../../interfaces/'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
    } catch (error) {
      console.log(error)
      return serverError(error)
    }
  }
}
