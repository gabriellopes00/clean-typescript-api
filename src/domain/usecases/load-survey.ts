import { SurveyModel } from '@domain/models/survey'

export interface LoadSurvey {
  load(): Promise<SurveyModel[]>
}
