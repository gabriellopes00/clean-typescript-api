import { LoadSurvey } from '@domain/usecases/load-survey'
import { noContent, ok, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpResponse } from '@presentation/interfaces'

export class LoadSurveyController implements Controller {
  constructor(private readonly loadSurvey: LoadSurvey) {}

  async handle(request: LoadSurveyController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load(request.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyController {
  export interface Request {
    accountId: string
  }
}
