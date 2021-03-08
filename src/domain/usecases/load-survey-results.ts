import { SurveyResultsModel } from '@domain/models/survey-results'

export interface LoadSurveyResult {
  load(surveyId: string): Promise<SurveyResultsModel>
}
