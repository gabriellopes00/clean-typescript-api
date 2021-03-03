import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyByIdRepository } from '../../interfaces/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyById } from './load-survey-by-id'
import mockDate from 'mockdate'
import { fakeSurveyModel } from '../../../domain/mocks/mock-survey'

class MockLoadSurveyByIdRepository implements LoadSurveyByIdRepository {
  async loadById(id: string): Promise<SurveyModel> {
    return new Promise(resolve => resolve(fakeSurveyModel))
  }
}

describe('DbLoadSurveyById', () => {
  const mockLoadSurveyByIdRepository = new MockLoadSurveyByIdRepository() as jest.Mocked<MockLoadSurveyByIdRepository>
  const sut = new DbLoadSurveyById(mockLoadSurveyByIdRepository)

  beforeAll(() => mockDate.set(new Date()))
  afterAll(() => mockDate.reset())

  test('Should call LoadSurveyRepository', async () => {
    const loadSpy = jest.spyOn(mockLoadSurveyByIdRepository, 'loadById')
    await sut.loadById('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return a survey on success', async () => {
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(fakeSurveyModel)
  })

  test('Should throw LoadSurveyByIdRepository throws', async () => {
    mockLoadSurveyByIdRepository.loadById.mockRejectedValueOnce(new Error())
    const error = sut.loadById('any_id')
    await expect(error).rejects.toThrow()
  })
})
