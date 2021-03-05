export interface SurveyResultAnswerModel {
  image?: string
  answer: string
  count: number
  percent: number
}

export interface SurveyResultsModel {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}
