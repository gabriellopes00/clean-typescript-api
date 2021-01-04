import { MongoHelper } from '../helpers/mongo'
import { MongoAccountRepository } from './account'

const makeSut = () => {
  const sut = new MongoAccountRepository()
  return { sut }
}

describe('Account Mongodb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: '1234'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('gabriel')
    expect(account.email).toBe('gabrielluislopes00@gmail.com')
    expect(account.password).toBe('1234')
  })
})
