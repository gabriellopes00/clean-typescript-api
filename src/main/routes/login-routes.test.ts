import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { fakeAccountParams, fakeLoginParams } from '../../domain/mocks/mock-account'
import { MongoHelper } from '../../infra/db/mongodb/helpers/index'
import app from '../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on login', async () => {
    const hashedPassword = await hash(fakeAccountParams.password, 12)
    await accountCollection.insertOne({ ...fakeAccountParams, password: hashedPassword })

    app.post('/api/login', (req, res) => res.send())
    await request(app).post('/api/login').send(fakeLoginParams).expect(200)
  })

  test('Should return 401 on unauthorized request', async () => {
    app.post('/api/login', (req, res) => res.send())
    await request(app).post('/api/login').send(fakeLoginParams).expect(401)
  })
})
