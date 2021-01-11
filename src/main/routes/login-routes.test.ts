import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import app from '../config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/index'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on login', async () => {
    const hashedPassword = await hash('gabriel123', 12)
    await accountCollection.insertOne({
      name: 'gabriel',
      email: 'gabriel@example.com',
      password: hashedPassword
    })

    app.post('/api/login', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'gabriel@example.com',
        password: 'gabriel123'
      })
      .expect(200)
  })

  test('Should return 401 on unauthorized request', async () => {
    app.post('/api/login', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'gabriel@example.com',
        password: 'gabriel123'
      })
      .expect(401)
  })
})
