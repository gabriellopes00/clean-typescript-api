import { LoadSurveyResultRepository } from '@data/interfaces/db/survey/load-survey-results-repository'
import { SaveSurveyResultsRepository } from '@data/interfaces/db/survey/save-survey-result-repository'
import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResults, SaveSurveyResultParams } from '@domain/usecases/save-survey-results'

export class DbSaveSurveyResults implements SaveSurveyResults {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultsRepository,
    private readonly loadSurveyResultsRepository: LoadSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultParams): Promise<SurveyResultsModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResults = await this.loadSurveyResultsRepository.loadBySurveyId(data.surveyId)
    return surveyResults
  }
}
