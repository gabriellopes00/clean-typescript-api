import { HttpRequest } from '../../interfaces'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { LoadSurveyById } from '../../../domain/usecases/load-survey'
import { SurveyModel } from '../../../domain/models/survey'
import { forbidden, serverError } from '../../helpers/http/http'
import { InvalidParamError } from '../../errors/invalid-param'
import { SurveyResultsModel } from '../../../domain/models/survey-results'

import {
  SaveSurveyResults,
  SaveSurveyResultsModel
} from '../../../domain/usecases/save-survey-results'

import mockDate from 'mockdate'

const fakeSurvey: SurveyModel = {
  id: 'asdf',
  date: new Date(),
  question: 'any_question',
  answers: [{ image: 'any_image', answer: 'any_answer' }]
}

const fakeSurveyResult: SurveyResultsModel = {
  id: 'asdf',
  date: new Date(),
  answer: 'any_answer',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id'
}

class FakeLoadSurveyById implements LoadSurveyById {
  async loadById(id: string): Promise<SurveyModel> {
    return fakeSurvey
  }
}

class FakeSaveSurveyResult implements SaveSurveyResults {
  async save(data: SaveSurveyResultsModel): Promise<SurveyResultsModel> {
    return fakeSurveyResult
  }
}

describe('Save survey result controller', () => {
  const fakeLoadSurveyById = new FakeLoadSurveyById() as jest.Mocked<FakeLoadSurveyById>
  const fakeSaveSurveyResult = new FakeSaveSurveyResult() as jest.Mocked<FakeSaveSurveyResult>
  const sut = new SaveSurveyResultController(fakeLoadSurveyById, fakeSaveSurveyResult)

  const fakeRequest: HttpRequest = {
    params: { surveyId: 'any_id' },
    body: { answer: 'any_answer' },
    accountId: 'any_account_id'
  }

  beforeAll(() => mockDate.set(new Date()))
  afterAll(() => mockDate.reset())

  test('Should call LoadSurveyById with correct values', async () => {
    const loadSpy = jest.spyOn(fakeLoadSurveyById, 'loadById')
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    fakeLoadSurveyById.loadById.mockResolvedValueOnce(null)
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 403 if an invalid response is provided', async () => {
    const response = await sut.handle({
      params: { surveyId: 'any_id' },
      body: { answer: 'wrong_answer' }
    })
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const saveSpy = jest.spyOn(fakeSaveSurveyResult, 'save')
    await sut.handle(fakeRequest)
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: 'any_answer'
    })
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    fakeLoadSurveyById.loadById.mockRejectedValueOnce(new Error())
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 500 if SaveSurveyResults throws', async () => {
    fakeSaveSurveyResult.save.mockRejectedValueOnce(new Error())
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })
})
