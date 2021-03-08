import { fakeSurveyResultModel } from '../../../domain/mocks/mock-survey-result'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { LoadSurveyResultRepository } from '../../interfaces/db/survey/load-survey-results-repository'
import { DbLoadSurveyResults } from './db-save-survey-result'

class MockLoadSurveyResultsRepository implements LoadSurveyResultRepository {
  async loadBySurveyId(surveyId: string): Promise<SurveyResultsModel> {
    return fakeSurveyResultModel
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  const mockLoadSurveyResultsRepository = new MockLoadSurveyResultsRepository() as jest.Mocked<MockLoadSurveyResultsRepository>
  const sut = new DbLoadSurveyResults(mockLoadSurveyResultsRepository)
  const surveyId = 'any_surveyId'

  test('Should call LoadSurveyResultRepository', async () => {
    const load = jest.spyOn(mockLoadSurveyResultsRepository, 'loadBySurveyId')
    await sut.load(surveyId)
    expect(load).toHaveBeenCalledWith(surveyId)
  })
})
