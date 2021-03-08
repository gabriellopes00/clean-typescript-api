import { SurveyResultsModel } from '@domain/models/survey-results'

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string): Promise<SurveyResultsModel>
}
