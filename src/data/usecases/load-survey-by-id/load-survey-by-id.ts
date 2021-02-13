import { LoadSurveyByIdRepository } from '@data/interfaces/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@domain/models/survey'

export class DbLoadSurveyById implements LoadSurveyByIdRepository {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}
