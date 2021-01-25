import { DbAddSurvey } from './ad-add-survey'
import { AddSurveyRepository } from '../../interfaces/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../domain/usecases/add-survey'

const makeSurveyFakeData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'answer'
    }
  ]
})

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  addSurveyRepositoryStub: AddSurveyRepository
  sut: DbAddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { addSurveyRepositoryStub, sut }
}

describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with correct values ', () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    sut.add(makeSurveyFakeData())
    expect(addSpy).toHaveBeenCalledWith(makeSurveyFakeData())
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.add(makeSurveyFakeData())
    await expect(promise).rejects.toThrow()
  })
})
