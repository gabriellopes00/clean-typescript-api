import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { MongoAccountRepository } from './mongo-account-repository'

const makeSut = () => {
  const sut = new MongoAccountRepository()
  return { sut }
}

let accountCollection: Collection

describe('Account Mongodb Repository', () => {
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

  test('Should return an account on add success', async () => {
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

  test('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()
    accountCollection.insertOne({
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: '1234'
    })
    const account = await sut.loadByEmail('gabrielluislopes00@gmail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('gabriel')
    expect(account.email).toBe('gabrielluislopes00@gmail.com')
    expect(account.password).toBe('1234')
  })

  test('Should return null if loadByEmail fails', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByEmail('gabrielluislopes00@gmail.com')
    expect(account).toBeFalsy()
  })

  test('Should create the account accessToken on AccessTokenSuccess', async () => {
    const { sut } = makeSut()
    const result = await accountCollection.insertOne({
      name: 'gabriel',
      email: 'gabrielluislopes00@gmail.com',
      password: '1234'
    })

    const fakeAccount = result.ops[0]
    expect(fakeAccount.accessToken).toBeFalsy()

    await sut.storeAccessToken(fakeAccount._id, 'any_token')
    const account = await accountCollection.findOne({ _id: fakeAccount._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBeTruthy()
  })
})