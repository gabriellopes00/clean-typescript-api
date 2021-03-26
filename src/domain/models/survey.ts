export interface SurveyAnswer {
  image?: string
  answer: string
}

export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswer[]
  date: Date
  didAnswer?: boolean
}
