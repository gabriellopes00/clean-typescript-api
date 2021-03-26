import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyRepository } from '../../interfaces/db/survey/load-survey-repository'
import { DbLoadSurvey } from './db-load-survey'
import { fakeSurveysModel } from '../../../domain/mocks/mock-survey'

class MockAdSurveyRepository implements LoadSurveyRepository {
  async loadAll(): Promise<SurveyModel[]> {
    return new Promise(resolve => resolve(fakeSurveysModel))
  }
}

describe('DbLoadSurvey', () => {
  const mockAdSurveyRepository = new MockAdSurveyRepository() as jest.Mocked<MockAdSurveyRepository>
  const sut = new DbLoadSurvey(mockAdSurveyRepository)
  const fakeId = 'any_id'

  test('Should call LoadSurveyRepository', async () => {
    const loadSpy = jest.spyOn(mockAdSurveyRepository, 'loadAll')
    await sut.load(fakeId)
    expect(loadSpy).toHaveBeenCalledWith(fakeId)
  })

  test('Should return a list of surveys on success', async () => {
    const surveys = await sut.load(fakeId)
    expect(surveys).toEqual(fakeSurveysModel)
  })

  test('Should throw LoadSurveyRepository throws', async () => {
    mockAdSurveyRepository.loadAll.mockRejectedValueOnce(new Error())
    const error = sut.load(fakeId)
    await expect(error).rejects.toThrow()
  })
})
