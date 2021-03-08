import mockDate from 'mockdate'
import { fakeSurveyModel } from '../../../domain/mocks/mock-survey'
import { fakeSurveyResultModel } from '../../../domain/mocks/mock-survey-result'
import { SurveyModel } from '../../../domain/models/survey'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { LoadSurveyByIdRepository } from '../../interfaces/db/survey/load-survey-by-id-repository'
import { LoadSurveyResultRepository } from '../../interfaces/db/survey/load-survey-results-repository'
import { DbLoadSurveyResults } from './db-load-survey-result'

class MockLoadSurveyResultsRepository implements LoadSurveyResultRepository {
  async loadBySurveyId(fakeSurveyId: string): Promise<SurveyResultsModel> {
    return fakeSurveyResultModel
  }
}

class MockLoadSurveyByIdRepository implements LoadSurveyByIdRepository {
  async loadById(id: string): Promise<SurveyModel> {
    return fakeSurveyModel
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  const mockLoadSurveyResultsRepository = new MockLoadSurveyResultsRepository() as jest.Mocked<MockLoadSurveyResultsRepository>
  const mockLoadSurveyByIdRepository = new MockLoadSurveyByIdRepository() as jest.Mocked<MockLoadSurveyByIdRepository>
  const sut = new DbLoadSurveyResults(mockLoadSurveyResultsRepository, mockLoadSurveyByIdRepository)
  const fakeSurveyId = 'any_surveyId'

  beforeAll(() => mockDate.set('2021-03-08T19:16:46.313Z'))
  afterAll(() => mockDate.reset())

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

  test('Should return a surveyResult model on success', async () => {
    const surveyResult = await sut.load(fakeSurveyId)
    expect(surveyResult).toEqual(fakeSurveyResultModel)
  })

  describe('LoadSurveyById repository', () => {
    test('Should call LoadSurveyById repository if  LoadSurveyResult repository returns null', async () => {
      mockLoadSurveyResultsRepository.loadBySurveyId.mockResolvedValueOnce(null)
      const loadSpy = jest.spyOn(mockLoadSurveyByIdRepository, 'loadById')
      await sut.load(fakeSurveyId)
      expect(loadSpy).toHaveBeenCalledWith(fakeSurveyId)
    })

    test('Should return a surveyResult with all answers if LoadSurveyResult repository returns null', async () => {
      mockLoadSurveyResultsRepository.loadBySurveyId.mockResolvedValueOnce(null)
      const surveyResult = await sut.load(fakeSurveyId)
      expect(surveyResult).toEqual(fakeSurveyResultModel)
    })
  })
})
