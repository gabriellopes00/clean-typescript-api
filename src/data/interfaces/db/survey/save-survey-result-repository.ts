import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResultParams } from '@domain/usecases/save-survey-results'

export interface SaveSurveyResultsRepository {
  save(data: SaveSurveyResultParams): Promise<SurveyResultsModel>
}
