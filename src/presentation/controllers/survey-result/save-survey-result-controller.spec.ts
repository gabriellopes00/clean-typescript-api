import mockDate from 'mockdate'
import { fakeSurveyModel } from '../../../domain/mocks/mock-survey'
import { fakeSurveyResultModel } from '../../../domain/mocks/mock-survey-result'
import { SurveyModel } from '../../../domain/models/survey'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { LoadSurveyById } from '../../../domain/usecases/load-survey'
import {
  SaveSurveyResultParams,
  SaveSurveyResults
} from '../../../domain/usecases/save-survey-results'
import { InvalidParamError } from '../../errors/invalid-param'
import { forbidden, ok, serverError } from '../../helpers/http/http'
import { HttpRequest } from '../../interfaces'
import { SaveSurveyResultController } from './save-survey-result-controller'

class MockLoadSurveyById implements LoadSurveyById {
  async loadById(id: string): Promise<SurveyModel> {
    return fakeSurveyModel
  }
}

class MockSaveSurveyResult implements SaveSurveyResults {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultsModel> {
    return fakeSurveyResultModel
  }
}

describe('Save survey result controller', () => {
  const mockLoadSurveyById = new MockLoadSurveyById() as jest.Mocked<MockLoadSurveyById>
  const mockSaveSurveyResult = new MockSaveSurveyResult() as jest.Mocked<MockSaveSurveyResult>
  const sut = new SaveSurveyResultController(mockLoadSurveyById, mockSaveSurveyResult)

  const fakeRequest: HttpRequest = {
    params: { surveyId: 'any_id' },
    body: { answer: 'any_answer' },
    accountId: 'any_account_id'
  }

  beforeAll(() => mockDate.set(new Date()))
  afterAll(() => mockDate.reset())

  describe('Load Survey By Id', () => {
    test('Should call LoadSurveyById with correct values', async () => {
      const loadSpy = jest.spyOn(mockLoadSurveyById, 'loadById')
      await sut.handle(fakeRequest)
      expect(loadSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should return 403 if LoadSurveyById returns null', async () => {
      mockLoadSurveyById.loadById.mockResolvedValueOnce(null)
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
    })

    test('Should return 500 if LoadSurveyById throws', async () => {
      mockLoadSurveyById.loadById.mockRejectedValueOnce(new Error())
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })
  })

  describe('Save Survey Result', () => {
    test('Should call SaveSurveyResult with correct values', async () => {
      const saveSpy = jest.spyOn(mockSaveSurveyResult, 'save')
      await sut.handle(fakeRequest)
      expect(saveSpy).toHaveBeenCalledWith({
        surveyId: 'any_id',
        accountId: 'any_account_id',
        date: new Date(),
        answer: 'any_answer'
      })
    })

    test('Should return 403 if an invalid response is provided', async () => {
      const response = await sut.handle({
        params: { surveyId: 'any_id' },
        body: { answer: 'wrong_answer' }
      })
      expect(response).toEqual(forbidden(new InvalidParamError('answer')))
    })

    test('Should return 500 if SaveSurveyResults throws', async () => {
      mockSaveSurveyResult.save.mockRejectedValueOnce(new Error())
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })

    test('Should return 200 on SaveSurveyResults success', async () => {
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(ok(fakeSurveyResultModel))
    })
  })
})
