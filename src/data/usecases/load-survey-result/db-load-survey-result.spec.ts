import { fakeSurveyResultModel } from '../../../domain/mocks/mock-survey-result'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { LoadSurveyResultRepository } from '../../interfaces/db/survey/load-survey-results-repository'
import { DbLoadSurveyResults } from './db-load-survey-result'

class MockLoadSurveyResultsRepository implements LoadSurveyResultRepository {
  async loadBySurveyId(fakeSurveyId: string): Promise<SurveyResultsModel> {
    return fakeSurveyResultModel
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  const mockLoadSurveyResultsRepository = new MockLoadSurveyResultsRepository() as jest.Mocked<MockLoadSurveyResultsRepository>
  const sut = new DbLoadSurveyResults(mockLoadSurveyResultsRepository)
  const fakeSurveyId = 'any_surveyId'

  test('Should call LoadSurveyResultRepository', async () => {
    const load = jest.spyOn(mockLoadSurveyResultsRepository, 'loadBySurveyId')
    await sut.load(fakeSurveyId)
    expect(load).toHaveBeenCalledWith(fakeSurveyId)
  })

  test('Should throw if SaveSurveyRepository throws', async () => {
    mockLoadSurveyResultsRepository.loadBySurveyId.mockRejectedValueOnce(new Error())
    const error = sut.load(fakeSurveyId)
    await expect(error).rejects.toThrow()
  })
})
