import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  // Change the "_id" returned from Mongodb to "id", understood by the AccountModel
  map(account: any): any {
    const { _id, ...presentationCollection } = account
    return Object.assign({}, presentationCollection, { id: _id })
  }
}
