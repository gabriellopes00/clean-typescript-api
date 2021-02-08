import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyRepository } from '../../interfaces/db/survey/load-survey-repository'
import { DbLoadSurvey } from './db-load-survey'

class FakeLoadSurveyRepository implements LoadSurveyRepository {
  async loadAll(): Promise<SurveyModel[]> {
    return new Promise(resolve => resolve(fakeSurveys))
  }
}

const fakeSurveys: SurveyModel[] = [
  {
    id: 'asdf',
    date: new Date(),
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  },
  {
    id: 'fdas',
    date: new Date(),
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ]
  }
]

describe('DbLoadSurvey', () => {
  const fakeLoadSurveyRepository = new FakeLoadSurveyRepository()
  const sut = new DbLoadSurvey(fakeLoadSurveyRepository)

  test('Should call LoadSurveyRepository', async () => {
    const loadSpy = jest.spyOn(fakeLoadSurveyRepository, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return a list of surveys on success', async () => {
    const surveys = await sut.load()
    expect(surveys).toEqual(fakeSurveys)
  })

  test('Should throw LoadSurveyRepository throws', async () => {
    jest.spyOn(fakeLoadSurveyRepository, 'loadAll').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const error = sut.load()
    await expect(error).rejects.toThrow()
  })
})
