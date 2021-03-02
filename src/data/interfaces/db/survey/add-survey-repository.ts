import { AddSurveyParams } from '@domain/usecases/add-survey'

export interface AddSurveyRepository {
  add(accountData: AddSurveyParams): Promise<void>
}
