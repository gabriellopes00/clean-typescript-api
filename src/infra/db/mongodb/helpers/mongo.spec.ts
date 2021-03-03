import { MongoHelper as sut } from './mongo'

describe('Mongo Helper', () => {
  beforeAll(async () => await sut.connect(process.env.MONGO_URL))
  afterAll(async () => await sut.disconnect())

  test('Should reconnect if mongodb is down', async () => {
    const accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
  })
})
