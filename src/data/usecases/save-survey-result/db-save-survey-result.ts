import { SaveSurveyResultsRepository } from '@data/interfaces/db/survey/save-survey-result-repository'
import { SurveyResultsModel } from '@domain/models/survey-results'
import {
  SaveSurveyResults,
  SaveSurveyResultsModel
} from '@domain/usecases/save-survey-results'

export class DbSaveSurveyResults implements SaveSurveyResults {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultsRepository
  ) {}

  async save(data: SaveSurveyResultsModel): Promise<SurveyResultsModel> {
    await this.saveSurveyResultRepository.save(data)
    return null
  }
}
