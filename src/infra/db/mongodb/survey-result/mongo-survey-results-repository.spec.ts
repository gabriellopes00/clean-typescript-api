import { SurveyModel } from '../../../../domain/models/survey'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo'
import { MongoSurveyResultRepository } from './mongo-survey-results-repository'
import { Collection } from 'mongodb'

const fakeSurveyData: SurveyModel = {
  id: 'any_id',
  date: new Date(),
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'answer'
    },
    {
      image: 'another_image',
      answer: 'another_answer'
    }
  ]
}

const fakeAccount: AccountModel = {
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
}

let surveyCollection: Collection
let surveyResultsCollection: Collection
let accountCollection: Collection

describe('Survey Mongodb Repository', () => {
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

    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('SaveSurveyResults', () => {
    test('Should add a survey result if its new', async () => {
      const insertedSurvey = await surveyCollection.insertOne(fakeSurveyData)
      const survey = insertedSurvey.ops[0]

      const insertedAccount = await accountCollection.insertOne(fakeAccount)
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
      const insertedSurvey = await surveyCollection.insertOne(fakeSurveyData)
      const survey = insertedSurvey.ops[0]

      const insertedAccount = await accountCollection.insertOne(fakeAccount)
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

  // describe('LoadAllSurveys', () => {
  //   test('Should load all surveys on success', async () => {
  //     const { sut } = makeSut()
  //     await surveyCollection.insertMany(fakeSurveys)
  //     const surveys = await sut.loadAll()
  //     expect(surveys.length).toBe(2)
  //     expect(surveys[0].id).toBe('asdf')
  //     expect(surveys[1].id).toBe('fdsa')
  //   })

  //   test('Should load an empty list if there are not surveys registered', async () => {
  //     const { sut } = makeSut()
  //     const surveys = await sut.loadAll()
  //     expect(surveys.length).toBe(0)
  //     expect(surveys).toBeInstanceOf(Array)
  //   })
  // })

  // describe('LoadSurveyById', () => {
  //   test('Should load a survey by id on success', async () => {
  //     const response = await surveyCollection.insertOne({
  //       date: new Date(),
  //       question: 'any_question',
  //       answers: [
  //         {
  //           image: 'any_image',
  //           answer: 'any_answer'
  //         }
  //       ]
  //     })
  //     const { sut } = makeSut()
  //     const survey = await sut.loadById(response.ops[0].id)
  //     expect(survey).toBeTruthy()
  //     expect(survey.question).toBe('any_question')
  //   })
  // })
})
