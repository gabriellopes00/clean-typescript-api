import { SurveyResultsModel } from '@domain/models/survey-results'
import { LoadSurveyResult } from '@domain/usecases/load-survey-results'
import { LoadSurveyResultRepository } from '@data/interfaces/db/survey/load-survey-results-repository'

export class DbLoadSurveyResults implements LoadSurveyResult {
  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load(surveyId: string): Promise<SurveyResultsModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return surveyResult
  }
}
