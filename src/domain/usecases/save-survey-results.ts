import { SurveyResultsModel } from '@domain/models/survey-results'

export interface SaveSurveyResultsModel
  extends Omit<SurveyResultsModel, 'id'> {}

export interface SaveSurveyResults {
  save(data: SaveSurveyResultsModel): Promise<SurveyResultsModel>
}
