import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResultParams } from '@domain/usecases/save-survey-results'

export const fakeSurveyResultModel: SurveyResultsModel = {
  surveyId: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
      count: 0,
      percent: 0,
      isCurrentAccountResponse: false
    },
    {
      answer: 'other_answer',
      image: 'other_image',
      count: 0,
      percent: 0,
      isCurrentAccountResponse: false
    }
  ],
  date: new Date('2021')
}

export const fakeSurveyResultParams: SaveSurveyResultParams = {
  date: new Date(),
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer'
}
