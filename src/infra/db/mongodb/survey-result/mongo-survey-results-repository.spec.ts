import { Collection, ObjectId } from 'mongodb'
import { fakeAccountModel } from '../../../../domain/mocks/mock-account'
import { fakeSurveyModel } from '../../../../domain/mocks/mock-survey'
import { MongoHelper } from '../helpers/mongo'
import { MongoSurveyResultRepository } from './mongo-survey-results-repository'

let surveyCollection: Collection
let surveyResultsCollection: Collection
let accountCollection: Collection

describe('Survey Mongodb Repository', () => {
  const sut = new MongoSurveyResultRepository()

  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultsCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('SaveSurveyResults', () => {
    test('Should add a survey result if its new', async () => {
      const insertedSurvey = await surveyCollection.insertOne(fakeSurveyModel)
      const survey = insertedSurvey.ops[0]

      const insertedAccount = await accountCollection.insertOne(fakeAccountModel)
      const account = insertedAccount.ops[0]

      const surveyResults = await sut.save({
        surveyId: survey._id,
        answer: survey.answers[0].answer,
        accountId: account._id,
        date: new Date()
      })
      expect(surveyResults).toBeTruthy()
      expect(surveyResults.surveyId).toEqual(survey._id)
      expect(surveyResults.answers[0].count).toBe(1)
      expect(surveyResults.answers[0].percent).toBe(100)
    })

    test('Should update a survey result if its not new', async () => {
      const insertedSurvey = await surveyCollection.insertOne(fakeSurveyModel)
      const survey = insertedSurvey.ops[0]

      const insertedAccount = await accountCollection.insertOne(fakeAccountModel)
      const account = insertedAccount.ops[0]

      await surveyResultsCollection.insertOne({
        surveyId: new ObjectId(survey._id),
        answer: survey.answers[0].answer,
        accountId: new ObjectId(account._id),
        date: new Date()
      })

      const surveyResults = await sut.save({
        surveyId: survey._id,
        answer: survey.answers[1].answer,
        accountId: account._id,
        date: new Date()
      })
      expect(surveyResults).toBeTruthy()
      expect(surveyResults.answers[0].answer).toEqual(survey.answers[1].answer)
      expect(surveyResults.answers[0].count).toBe(1)
      expect(surveyResults.answers[0].percent).toBe(100)
    })
  })
})
