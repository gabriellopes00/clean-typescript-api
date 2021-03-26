import MockDate from 'mockdate'
import {
  fakeSurveyResultModel,
  fakeSurveyResultParams
} from '../../../domain/mocks/mock-survey-result'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { SaveSurveyResultParams } from '../../../domain/usecases/save-survey-results'
import { LoadSurveyResultRepository } from '../../interfaces/db/survey/load-survey-results-repository'
import { SaveSurveyResultsRepository } from '../../interfaces/db/survey/save-survey-result-repository'
import { DbSaveSurveyResults } from './db-save-survey-result'

class MockSaveSurveyResultsRepository implements SaveSurveyResultsRepository {
  async save(data: SaveSurveyResultParams): Promise<void> {
    return Promise.resolve()
  }
}

class MockLoadSurveyResultsRepository implements LoadSurveyResultRepository {
  async loadBySurveyId(surveyId: string, accountId: string): Promise<SurveyResultsModel> {
    return fakeSurveyResultModel
  }
}

describe('DbSaveSurveyResults Usecase', () => {
  const mockSaveSurveyResultsRepository = new MockSaveSurveyResultsRepository() as jest.Mocked<MockSaveSurveyResultsRepository>
  const mockLoadSurveyResultsRepository = new MockLoadSurveyResultsRepository() as jest.Mocked<MockLoadSurveyResultsRepository>
  const sut = new DbSaveSurveyResults(
    mockSaveSurveyResultsRepository,
    mockLoadSurveyResultsRepository
  )

  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  describe('SaveSurvey repository', () => {
    test('Should call SaveSurveyRepository with correct values ', async () => {
      const saveSpy = jest.spyOn(mockSaveSurveyResultsRepository, 'save')
      await sut.save(fakeSurveyResultParams)
      expect(saveSpy).toHaveBeenCalledWith(fakeSurveyResultParams)
    })

    test('Should return a SurveyModel on success', async () => {
      const result = await sut.save(fakeSurveyResultParams)
      expect(result).toEqual(fakeSurveyResultModel)
    })

    test('Should throw if SaveSurveyRepository throws', async () => {
      mockSaveSurveyResultsRepository.save.mockRejectedValueOnce(new Error())
      const error = sut.save(fakeSurveyResultParams)
      await expect(error).rejects.toThrow()
    })
  })

  describe('LoadSurveyResult Repository', () => {
    test('Should call LoadSurveyRepository with correct values ', async () => {
      const loadSpy = jest.spyOn(mockLoadSurveyResultsRepository, 'loadBySurveyId')
      await sut.save(fakeSurveyResultParams)
      expect(loadSpy).toHaveBeenCalledWith(
        fakeSurveyResultParams.surveyId,
        fakeSurveyResultParams.accountId
      )
    })

    test('Should throw if LoadSurveyRepository throws', async () => {
      mockLoadSurveyResultsRepository.loadBySurveyId.mockRejectedValueOnce(new Error())
      const error = sut.save(fakeSurveyResultParams)
      await expect(error).rejects.toThrow()
    })
  })
})
