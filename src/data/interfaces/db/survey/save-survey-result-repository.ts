import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResultsModel } from '@domain/usecases/save-survey-results'

export interface SaveSurveyResultsRepository {
  save(data: SaveSurveyResultsModel): Promise<SurveyResultsModel>
}
