import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyByIdRepository } from '../../interfaces/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyById } from './load-survey-by-id'
import mockDate from 'mockdate'

class FakeLoadSurveyByIdRepository implements LoadSurveyByIdRepository {
  async loadById(id: string): Promise<SurveyModel> {
    return new Promise(resolve => resolve(fakeSurvey))
  }
}

const fakeSurvey: SurveyModel = {
  id: 'asdf',
  date: new Date(),
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ]
}

describe('DbLoadSurveyById', () => {
  const fakeLoadSurveyByIdRepository = new FakeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(fakeLoadSurveyByIdRepository)

  beforeAll(() => mockDate.set(new Date()))
  afterAll(() => mockDate.reset())

  test('Should call LoadSurveyRepository', async () => {
    const loadSpy = jest.spyOn(fakeLoadSurveyByIdRepository, 'loadById')
    await sut.loadById('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return a survey on success', async () => {
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(fakeSurvey)
  })

  // test('Should throw LoadSurveyRepository throws', async () => {
  //   jest
  //     .spyOn(fakeLoadSurveyByIdRepository, 'loadById')
  //     .mockRejectedValueOnce(new Error())
  //   const error = sut.loadById('any_id')
  //   await expect(error).rejects.toThrow()
  // })
})
