import { LoadSurveyController } from './load-survey-controller'
import { LoadSurvey } from '../../../../domain/usecases/load-survey'
import { SurveyModel } from '../../../../domain/models/survey'
import { noContent, ok, serverError } from '../../../helpers/http/http'
import MockDate from 'mockdate'

class FakeLoadSurvey implements LoadSurvey {
  async load(): Promise<SurveyModel[]> {
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

describe('LoadSurvey Controller', () => {
  const loadSurvey = new FakeLoadSurvey()
  const sut = new LoadSurveyController(loadSurvey)

  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset)

  test('Should call LoadSurvey', async () => {
    const loadSpy = jest.spyOn(loadSurvey, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 with surveys data on success', async () => {
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(fakeSurveys))
  })

  test('Should return 500 if loadSurvey throws', async () => {
    jest
      .spyOn(loadSurvey, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const error = await sut.handle({})
    expect(error).toEqual(serverError(new Error()))
  })

  test('Should return 204 if loadSurvey returns empty', async () => {
    jest
      .spyOn(loadSurvey, 'load')
      .mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })
})
