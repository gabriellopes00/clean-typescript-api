import { DbSaveSurveyResults } from './db-save-survey-result'
import { SurveyResultsModel } from '../../../domain/models/survey-results'
import { SaveSurveyResultsModel } from '../../../domain/usecases/save-survey-results'
import { SaveSurveyResultsRepository } from '../../interfaces/db/survey/save-survey-result-repository'
import MockDate from 'mockdate'

const fakeSaveSurveyData: SaveSurveyResultsModel = {
  date: new Date(),
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer'
}

const fakeSurveyData: SurveyResultsModel = {
  id: 'any_id',
  date: new Date(),
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer'
}

class FakeSaveSurveyResultsRepository implements SaveSurveyResultsRepository {
  async save(data: SaveSurveyResultsModel): Promise<SurveyResultsModel> {
    return new Promise(resolve => resolve(fakeSurveyData))
  }
}

describe('DbSaveSurveyResults Usecase', () => {
  const fakeSaveSurveyResultsRepository = new FakeSaveSurveyResultsRepository()
  const sut = new DbSaveSurveyResults(fakeSaveSurveyResultsRepository)

  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call SaveSurveyRepository with correct values ', async () => {
    const saveSpy = jest.spyOn(fakeSaveSurveyResultsRepository, 'save')
    await sut.save(fakeSaveSurveyData)
    expect(saveSpy).toHaveBeenCalledWith(fakeSaveSurveyData)
  })

  test('Should throw if SaveSurveyRepository throws', async () => {
    jest
      .spyOn(fakeSaveSurveyResultsRepository, 'save')
      .mockRejectedValueOnce(new Error())
    const error = sut.save(fakeSaveSurveyData)
    await expect(error).rejects.toThrow()
  })
})
