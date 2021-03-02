import { SaveSurveyResultsRepository } from '@data/interfaces/db/survey/save-survey-result-repository'
import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResults, SaveSurveyResultParams } from '@domain/usecases/save-survey-results'

export class DbSaveSurveyResults implements SaveSurveyResults {
  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultsRepository) {}

  async save(data: SaveSurveyResultParams): Promise<SurveyResultsModel> {
    const surveyData = await this.saveSurveyResultRepository.save(data)
    return surveyData
  }
}
