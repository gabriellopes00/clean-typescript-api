import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResultParams } from '@domain/usecases/save-survey-results'

export const fakeSurveyResultModel: SurveyResultsModel = {
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
}

export const fakeSurveyResultParams: SaveSurveyResultParams = {
  date: new Date(),
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer'
}
