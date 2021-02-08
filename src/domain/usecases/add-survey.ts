import { SurveyModel } from '@domain/models/survey'

export interface AddSurveyModel extends Omit<SurveyModel, 'id'> {}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>
}
