import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from '../../interfaces/db/survey/add-survey-repository'
import { AddSurveyParams } from '../../../domain/usecases/add-survey'
import MockDate from 'mockdate'
import { fakeSurveyParams as surveyParams } from '../../../domain/mocks/mock-survey'

const fakeSurveyParams = { ...surveyParams, date: new Date() }

class MockAddSurveyRepository implements AddSurveyRepository {
  async add(data: AddSurveyParams): Promise<void> {
    return new Promise(resolve => resolve())
  }
}

describe('DbAddSurvey Usecase', () => {
  const mockAddSurveyRepository = new MockAddSurveyRepository() as jest.Mocked<MockAddSurveyRepository>
  const sut = new DbAddSurvey(mockAddSurveyRepository)

  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call AddSurveyRepository with correct values ', () => {
    const addSpy = jest.spyOn(mockAddSurveyRepository, 'add')
    sut.add(fakeSurveyParams)
    expect(addSpy).toHaveBeenCalledWith(fakeSurveyParams)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    mockAddSurveyRepository.add.mockRejectedValueOnce(new Error())
    const promise = sut.add(fakeSurveyParams)
    await expect(promise).rejects.toThrow()
  })
})
