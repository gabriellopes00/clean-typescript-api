import { HttpRequest } from '../../interfaces'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { LoadSurveyById } from '../../../domain/usecases/load-survey'
import { SurveyModel } from '../../../domain/models/survey'
import { forbidden } from '../../helpers/http/http'
import { InvalidParamError } from '../../errors/invalid-param'

const fakeSurvey: SurveyModel = {
  id: 'asdf',
  date: new Date(),
  question: 'any_question',
  answers: [{ image: 'any_image', answer: 'any_answer' }]
}

class FakeLoadSurveyById implements LoadSurveyById {
  async loadById(id: string): Promise<SurveyModel> {
    return fakeSurvey
  }
}

describe('Save survey result controller', () => {
  const fakeLoadSurveyById = new FakeLoadSurveyById() as jest.Mocked<FakeLoadSurveyById>
  const sut = new SaveSurveyResultController(fakeLoadSurveyById)
  const fakeRequest: HttpRequest = {
    params: {
      surveyId: 'any_id'
    }
  }

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
})
