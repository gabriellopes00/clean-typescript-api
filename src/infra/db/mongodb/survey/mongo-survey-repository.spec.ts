import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo'
import { MongoSurveyRepository } from './mongo-survey-repository'

const makeSurveyFakeData = (): AddSurveyModel => ({
  date: new Date(),
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'answer'
    }
  ]
})

const makeSut = () => {
  const sut = new MongoSurveyRepository()
  return { sut }
}

let surveyCollection: Collection

describe('Survey Mongodb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should add a survey on success', async () => {
    const { sut } = makeSut()
    await sut.add(makeSurveyFakeData())
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
