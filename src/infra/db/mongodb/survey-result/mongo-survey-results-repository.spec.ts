import { Collection } from 'mongodb'
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
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        accountId: account.id,
        date: new Date()
      })
      expect(surveyResults).toBeTruthy()
      expect(surveyResults.id).toBeTruthy()
      expect(surveyResults.answer).toBe(survey.answers[0].answer)
    })

    test('Should update a survey result if its not new', async () => {
      const insertedSurvey = await surveyCollection.insertOne(fakeSurveyModel)
      const survey = insertedSurvey.ops[0]

      const insertedAccount = await accountCollection.insertOne(fakeAccountModel)
      const account = insertedAccount.ops[0]

      const insertedSurveyResults = await surveyResultsCollection.insertOne({
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        accountId: account.id,
        date: new Date()
      })

      const surveyResults = await sut.save({
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        accountId: account.id,
        date: new Date()
      })
      expect(surveyResults).toBeTruthy()
      expect(surveyResults.id).toEqual(insertedSurveyResults.ops[0]._id)
      expect(surveyResults.answer).toBe(survey.answers[1].answer)
    })
  })
})
