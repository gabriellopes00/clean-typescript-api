import { SurveyModel } from '@domain/models/survey'

export interface AddSurveyParams extends Omit<SurveyModel, 'id'> {}

export interface AddSurvey {
  add(data: AddSurveyParams): Promise<void>
}
