import request from 'supertest'
import { fakeAccountParams } from '../../domain/mocks/mock-account'
import { MongoHelper } from '../../infra/db/mongodb/helpers/index'
import app from '../config/app'

describe('SigUp Routes', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on sign', async () => {
    app.post('/api/signup', (req, res) => res.send())
    await request(app)
      .post('/api/signup')
      .send({ ...fakeAccountParams, passwordConfirmation: 'any_password' })
      .expect(200)
  })
})
