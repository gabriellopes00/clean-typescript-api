import MockDate from 'mockdate'
import { fakeSurveyParams } from '../../../../domain/mocks/mock-survey'
import { AddSurvey, AddSurveyParams } from '../../../../domain/usecases/add-survey'
import { badRequest, noContent, serverError } from '../../../helpers/http/http'
import { Validation } from '../../../interfaces'
import { AddSurveyController } from './add-survey'

class MockValidation implements Validation {
  validate(input: any): Error {
    return null
  }
}

class MockAddSurvey implements AddSurvey {
  async add(data: AddSurveyParams): Promise<void> {
    return new Promise(resolve => resolve())
  }
}

describe('AddSurvey Controller', () => {
  const mockValidation = new MockValidation() as jest.Mocked<MockValidation>
  const mockAddSurvey = new MockAddSurvey() as jest.Mocked<MockAddSurvey>
  const sut = new AddSurveyController(mockValidation, mockAddSurvey)

  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset)

  const fakeRequest: AddSurveyController.Request = {
    question: fakeSurveyParams.question,
    answers: fakeSurveyParams.answers
  }

  describe('Validation', () => {
    test('Should call Validation with correct values', async () => {
      const validateSpy = jest.spyOn(mockValidation, 'validate')
      await sut.handle(fakeRequest)
      expect(validateSpy).toHaveBeenCalledWith(fakeRequest)
    })

    test('Should return 400 if Validation fails', async () => {
      mockValidation.validate.mockReturnValueOnce(new Error())
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(badRequest(new Error()))
    })
  })

  describe('AddSurvey', () => {
    test('Should call AddSurvey with correct values', async () => {
      const addSpy = jest.spyOn(mockAddSurvey, 'add')
      await sut.handle(fakeRequest)
      expect(addSpy).toHaveBeenCalledWith({ ...fakeRequest, date: new Date() })
    })

    test('Should return 500 if AddSurvey throws', async () => {
      mockAddSurvey.add.mockRejectedValueOnce(new Error())
      const error = await sut.handle(fakeRequest)
      expect(error).toEqual(serverError(new Error()))
    })

    test('Should return 204 on success', async () => {
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(noContent())
    })
  })
})
