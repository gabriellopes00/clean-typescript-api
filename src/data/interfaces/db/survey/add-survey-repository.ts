import { AddSurveyModel } from '@domain/usecases/add-survey'

export interface AddSurveyRepository {
  add(accountData: AddSurveyModel): Promise<void>
}
