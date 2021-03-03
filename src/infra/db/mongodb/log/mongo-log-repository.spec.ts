import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { MongoLogRepository } from './mongo-log-repository'

describe('Log Mongo Repository', () => {
  const sut = new MongoLogRepository()
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    await sut.logError('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
