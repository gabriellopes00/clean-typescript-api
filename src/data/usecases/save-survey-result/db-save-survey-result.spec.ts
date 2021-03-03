import MockDate from 'mockdate'
import {
  fakeSurveyResultModel,
  fakeSurveyResultParams
} from '../../../domain/mocks/mock-survey-result'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { SaveSurveyResultParams } from '../../../domain/usecases/save-survey-results'
import { SaveSurveyResultsRepository } from '../../interfaces/db/survey/save-survey-result-repository'
import { DbSaveSurveyResults } from './db-save-survey-result'

class MockSaveSurveyResultsRepository implements SaveSurveyResultsRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultsModel> {
    return new Promise(resolve => resolve(fakeSurveyResultModel))
  }
}

describe('DbSaveSurveyResults Usecase', () => {
  const mockSaveSurveyResultsRepository = new MockSaveSurveyResultsRepository() as jest.Mocked<MockSaveSurveyResultsRepository>
  const sut = new DbSaveSurveyResults(mockSaveSurveyResultsRepository)

  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

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
