import { SurveyModel } from '@domain/models/survey'

export interface LoadSurveyRepository {
  loadAll(accountId: string): Promise<SurveyModel[]>
}
