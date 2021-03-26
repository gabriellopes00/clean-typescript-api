export interface SurveyResultAnswerModel {
  image?: string
  answer: string
  count: number
  percent: number
  isCurrentAccountResponse: boolean
}

export interface SurveyResultsModel {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}
