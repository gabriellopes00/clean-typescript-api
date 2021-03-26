import MockDate from 'mockdate'
import { fakeSurveysModel } from '../../../../domain/mocks/mock-survey'
import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurvey } from '../../../../domain/usecases/load-survey'
import { noContent, ok, serverError } from '../../../helpers/http/http'
import { LoadSurveyController } from './load-survey-controller'

class MockLoadSurvey implements LoadSurvey {
  async load(): Promise<SurveyModel[]> {
    return new Promise(resolve => resolve(fakeSurveysModel))
  }
}

describe('LoadSurvey Controller', () => {
  const mockLoadSurvey = new MockLoadSurvey() as jest.Mocked<MockLoadSurvey>
  const sut = new LoadSurveyController(mockLoadSurvey)
  const fakeRequest = { accountId: 'anu_id' }

  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset)

  test('Should call LoadSurvey with correct values', async () => {
    const loadSpy = jest.spyOn(mockLoadSurvey, 'load')
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.accountId)
  })

  test('Should return 200 with surveys data on success', async () => {
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(ok(fakeSurveysModel))
  })

  test('Should return 500 if loadSurvey throws', async () => {
    mockLoadSurvey.load.mockRejectedValueOnce(new Error())
    const error = await sut.handle(fakeRequest)
    expect(error).toEqual(serverError(new Error()))
  })

  test('Should return 204 if loadSurvey returns empty', async () => {
    mockLoadSurvey.load.mockResolvedValueOnce([])
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
