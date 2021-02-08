import { AddSurveyRepository } from '@data/interfaces/db/survey/add-survey-repository'
import { AddSurvey, AddSurveyModel } from '@domain/usecases/add-survey'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
  async add(data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
