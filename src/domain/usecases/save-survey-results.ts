import { SurveyResultsModel } from '@domain/models/survey-results'

export interface SaveSurveyResultParams {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResults {
  save(data: SaveSurveyResultParams): Promise<SurveyResultsModel>
}
