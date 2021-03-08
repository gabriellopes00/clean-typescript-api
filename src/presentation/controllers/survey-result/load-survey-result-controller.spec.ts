import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from '../../interfaces/http'
import { LoadSurveyById } from '../../../domain/usecases/load-survey'
import { SurveyModel } from '../../../domain/models/survey'

const fakeRequest: HttpRequest = { params: { surveyId: 'any_id' } }

class MockLoadSurveyById implements LoadSurveyById {
  loadById(id: string): Promise<SurveyModel> {
    return null
  }
}

describe('LoadSurvey Controller', () => {
  const mockLoadSurveyById = new MockLoadSurveyById() as jest.Mocked<MockLoadSurveyById>
  const sut = new LoadSurveyResultController(mockLoadSurveyById)

  test('Should call LoadSurveyById with correct values', async () => {
    const loadSpy = jest.spyOn(mockLoadSurveyById, 'loadById')
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })
})
