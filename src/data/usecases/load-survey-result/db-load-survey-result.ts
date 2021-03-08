import { SurveyResultsModel } from '@domain/models/survey-results'
import { LoadSurveyResult } from '@domain/usecases/load-survey-results'
import { LoadSurveyResultRepository } from '@data/interfaces/db/survey/load-survey-results-repository'
import { LoadSurveyByIdRepository } from '@data/interfaces/db/survey/load-survey-by-id-repository'

export class DbLoadSurveyResults implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultsModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }
    return surveyResult
  }
}
