import { SurveyResultsModel } from '@domain/models/survey-results'

export interface SaveSurveyResultParams extends Omit<SurveyResultsModel, 'id'> {}

export interface SaveSurveyResults {
  save(data: SaveSurveyResultParams): Promise<SurveyResultsModel>
}
