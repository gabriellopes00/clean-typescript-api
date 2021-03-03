import { Collection } from 'mongodb'
import { fakeSurveyParams, fakeSurveysModel } from '../../../../domain/mocks/mock-survey'
import { MongoHelper } from '../helpers/mongo'
import { MongoSurveyRepository } from './mongo-survey-repository'

let surveyCollection: Collection

describe('Survey Mongodb Repository', () => {
  const sut = new MongoSurveyRepository()

  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('AddSurvey', () => {
    test('Should add a survey on success', async () => {
      await sut.add({ ...fakeSurveyParams, date: new Date() })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('LoadAllSurveys', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany(fakeSurveysModel)
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].id).toBeTruthy()
    })

    test('Should load an empty list if there are not surveys registered', async () => {
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
      expect(surveys).toBeInstanceOf(Array)
    })
  })

  describe('LoadSurveyById', () => {
    test('Should load a survey by id on success', async () => {
      const response = await surveyCollection.insertOne({ ...fakeSurveyParams })

      const survey = await sut.loadById(response.ops[0]._id)
      expect(survey).toBeTruthy()
      expect(survey.question).toBe('any_question')
    })
  })
})
