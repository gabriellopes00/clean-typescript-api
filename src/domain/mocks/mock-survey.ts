import { AddSurveyParams } from '@domain/usecases/add-survey'
import { SurveyModel } from '../models/survey'

export const fakeSurveyModel: SurveyModel = {
  id: 'any_id',
  date: new Date(),
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' },
    { image: 'other_image', answer: 'other_answer' }
  ]
}

export const fakeSurveyParams: Omit<AddSurveyParams, 'date'> = {
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' },
    { image: 'other_image', answer: 'other_answer' }
  ]
}

export const fakeSurveysModel: SurveyModel[] = [
  {
    id: 'asdf',
    date: new Date(),
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }]
  },
  {
    id: 'fdas',
    date: new Date(),
    question: 'other_question',
    answers: [{ image: 'other_image', answer: 'other_answer' }]
  }
]
