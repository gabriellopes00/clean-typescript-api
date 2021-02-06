import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'

let surveyCollection: Collection

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
})
