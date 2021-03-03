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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app).post('/api/surveys').send(fakeSurveyParams).expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const account = await accountCollection.insertOne({ ...fakeAccountParams, role: 'adm' })
      const id = account.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      await request(app)
        .post('/api/surveys')
        .set('access-token', accessToken)
        .send(fakeSurveyParams)
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    test('Should return 204 on load survey with valid accessToken', async () => {
      const account = await accountCollection.insertOne(fakeAccountParams)
      const id = account.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
      await request(app).get('/api/surveys').set('access-token', accessToken).expect(204)
    })
  })
})
