import { LogErrorRepository } from '@data/interfaces/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo'

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
