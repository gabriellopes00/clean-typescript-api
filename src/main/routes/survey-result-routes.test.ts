import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { fakeSurveyParams } from '../../domain/mocks/mock-survey'
import { fakeAccountParams } from '../../domain/mocks/mock-account'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const res = await surveyCollection.insertOne({ ...fakeSurveyParams, date: new Date() })

      const account = await accountCollection.insertOne(fakeAccountParams)
      const id = account.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      await request(app)
        .put(`/api/surveys/${res.ops[0]._id}/results`)
        .set('access-token', accessToken)
        .send({ answer: 'any_answer' })
        .expect(200)
    })
  })
})
