import { SurveyModel } from '@domain/models/survey'

export interface LoadSurveyRepository {
  loadAll(): Promise<SurveyModel[]>
}
