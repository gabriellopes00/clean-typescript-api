import { Collection, ObjectId } from 'mongodb'
import { fakeAccountModel } from '../../../../domain/mocks/mock-account'
import { fakeSurveyModel } from '../../../../domain/mocks/mock-survey'
import { AccountModel } from '../../../../domain/models/account'
import { SurveyModel } from '../../../../domain/models/survey'
import { MongoHelper } from '../helpers/mongo'
import { MongoSurveyResultRepository } from './mongo-survey-results-repository'

let surveyCollection: Collection
let surveyResultsCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer_1'
      },
      {
        answer: 'any_answer_2'
      },
      {
        answer: 'any_answer_3'
      }
    ],
    date: new Date()
  })
  return MongoHelper.map(res.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return MongoHelper.map(res.ops[0])
}

describe('Survey Mongo Repository', () => {
  const sut = new MongoSurveyResultRepository()
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultsCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultsCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update a survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultsCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultsCollection
        .find({
          surveyId: survey.id,
          accountId: account.id
        })
        .toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('LoadSurveyResult', () => {
    test('Should load a survey result', async () => {
      const insertedSurvey = await surveyCollection.insertOne(fakeSurveyModel)
      const survey = insertedSurvey.ops[0]

      const insertedAccount = await accountCollection.insertOne(fakeAccountModel)
      const account = insertedAccount.ops[0]

      await surveyResultsCollection.insertMany([
        {
          surveyId: new ObjectId(survey._id),
          answer: survey.answers[0].answer,
          accountId: new ObjectId(account._id),
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey._id),
          answer: survey.answers[1].answer,
          accountId: new ObjectId(account._id),
          date: new Date()
        }
      ])

      const surveyResults = await sut.loadBySurveyId(survey._id)
      expect(surveyResults).toBeTruthy()
      expect(surveyResults.surveyId).toEqual(survey._id)
      expect(surveyResults.answers[0].count).toBe(1)
      expect(surveyResults.answers[0].percent).toBe(50)
      expect(surveyResults.answers[1].count).toBe(1)
      expect(surveyResults.answers[1].percent).toBe(50)
    })
  })
})
