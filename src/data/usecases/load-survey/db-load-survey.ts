import { LoadSurveyRepository } from '@data/interfaces/db/survey/load-survey-repository'
import { SurveyModel } from '@domain/models/survey'
import { LoadSurvey } from '@domain/usecases/load-survey'

export class DbLoadSurvey implements LoadSurvey {
  constructor(private readonly loadSurveyRepository: LoadSurveyRepository) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepository.loadAll(accountId)
    return surveys
  }
}
