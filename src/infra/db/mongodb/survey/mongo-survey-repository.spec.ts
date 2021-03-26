import { Collection } from 'mongodb'
import { fakeSurveyParams, fakeSurveysModel } from '../../../../domain/mocks/mock-survey'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo'
import { MongoSurveyRepository } from './mongo-survey-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return MongoHelper.map(res.ops[0])
}

describe('Survey Mongodb Repository', () => {
  const sut = new MongoSurveyRepository()

  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('account')
    surveyResultCollection = await MongoHelper.getCollection('surveyResult')
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
    await accountCollection.deleteMany({})
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
      const account = await makeAccount()
      const result = await surveyCollection.insertMany(fakeSurveysModel)
      const survey = result.ops[0]
      await surveyResultCollection.insertOne({
        accountId: account.id,
        date: new Date(),
        surveyId: survey._id,
        answer: survey.answers[0].answer
      })
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].didAnswer).toBeTruthy()
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].didAnswer).toBeFalsy()
    })

    test('Should load an empty list if there are not surveys registered', async () => {
      const account = await makeAccount()
      const surveys = await sut.loadAll(account.id)
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
