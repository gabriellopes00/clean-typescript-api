import { SurveyModel } from '@domain/models/survey'

export interface LoadSurvey {
  load(accountId: string): Promise<SurveyModel[]>
}

export interface LoadSurveyById {
  loadById(id: string): Promise<SurveyModel>
}
