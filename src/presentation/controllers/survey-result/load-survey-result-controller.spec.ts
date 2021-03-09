import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from '../../interfaces/http'
import { LoadSurveyById } from '../../../domain/usecases/load-survey'
import { SurveyModel } from '../../../domain/models/survey'
import { InvalidParamError } from '../../errors/invalid-param'
import { forbidden, ok, serverError } from '../../helpers/http/http'
import { LoadSurveyResult } from '../../../domain/usecases/load-survey-results'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { fakeSurveyResultModel } from '../../../domain/mocks/mock-survey-result'
import { fakeSurveyModel } from '../../../domain/mocks/mock-survey'
import mockDate from 'mockdate'

const fakeRequest: HttpRequest = { params: { surveyId: 'any_id' } }

class MockLoadSurveyById implements LoadSurveyById {
  async loadById(id: string): Promise<SurveyModel> {
    return fakeSurveyModel
  }
}

class MockLoadSurveyResult implements LoadSurveyResult {
  async load(surveyId: string): Promise<SurveyResultsModel> {
    return fakeSurveyResultModel
  }
}

describe('LoadSurvey Controller', () => {
  const mockLoadSurveyById = new MockLoadSurveyById() as jest.Mocked<MockLoadSurveyById>
  const mockLoadSurveyResult = new MockLoadSurveyResult() as jest.Mocked<MockLoadSurveyResult>
  const sut = new LoadSurveyResultController(mockLoadSurveyById, mockLoadSurveyResult)

  beforeAll(() => mockDate.set(new Date()))
  afterAll(() => mockDate.reset())

  test('Should call LoadSurveyById with correct values', async () => {
    const loadSpy = jest.spyOn(mockLoadSurveyById, 'loadById')
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })

  test('Should return 403 if an invalid survey id is provided', async () => {
    mockLoadSurveyById.loadById.mockResolvedValueOnce(null)
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    mockLoadSurveyById.loadById.mockRejectedValueOnce(new Error())
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const loadSpy = jest.spyOn(mockLoadSurveyResult, 'load')
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    mockLoadSurveyResult.load.mockRejectedValueOnce(new Error())
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(ok(fakeSurveyResultModel))
  })
})
