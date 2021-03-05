import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResultParams } from '@domain/usecases/save-survey-results'

export const fakeSurveyResultModel: SurveyResultsModel = {
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    { answer: 'any_answer', image: 'any_image', count: 100, percent: 50 },
    { answer: 'other_answer', image: 'other_image', count: 50, percent: 75 }
  ],
  date: new Date()
}

export const fakeSurveyResultParams: SaveSurveyResultParams = {
  date: new Date(),
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer'
}
