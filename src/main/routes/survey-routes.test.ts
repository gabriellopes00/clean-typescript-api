import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})
afterAll(async () => {
  await MongoHelper.disconnect()
})
beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('surveys')
  await surveyCollection.deleteMany({})
  accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

describe('Survey Routes', () => {
  test('Should return 403 on add survey without accessToken', async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: 'How many is 1 + 1 ?',
        answers: [
          {
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/NYCS-bull-trans-2.svg/768px-NYCS-bull-trans-2.svg.png',
            answer: '2'
          }
        ]
      })
      .expect(403)
  })

  test('Should return 204 on add survey with valid accessToken', async () => {
    const account = await accountCollection.insertOne({
      name: 'gabriel',
      email: 'gabriel@example.com',
      password: 'asdf',
      role: 'adm'
    })
    const id = account.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
    await request(app)
      .post('/api/surveys')
      .set('access-token', accessToken)
      .send({
        question: 'How many is 1 + 1 ?',
        answers: [
          {
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/NYCS-bull-trans-2.svg/768px-NYCS-bull-trans-2.svg.png',
            answer: '2'
          }
        ]
      })
      .expect(403)
  })
})
