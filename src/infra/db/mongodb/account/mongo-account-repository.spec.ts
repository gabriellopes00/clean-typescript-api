import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { MongoAccountRepository } from './mongo-account-repository'

describe('Account Mongodb Repository', () => {
  const sut = new MongoAccountRepository()
  let accountCollection: Collection

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

  describe('AddAccount', () => {
    test('Should return an account on add success', async () => {
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

  describe('LoadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
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
      const account = await sut.loadByEmail('gabrielluislopes00@gmail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('AccessToken', () => {
    test('Should create the account accessToken on AccessTokenSuccess', async () => {
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

  describe('LoadByToken', () => {
    test('Should return an account on loadByToken success without role', async () => {
      accountCollection.insertOne({
        name: 'gabriel',
        email: 'gabrielluislopes00@gmail.com',
        password: '1234',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('gabriel')
      expect(account.email).toBe('gabrielluislopes00@gmail.com')
      expect(account.password).toBe('1234')
    })

    test('Should return an account on loadByToken success with role', async () => {
      accountCollection.insertOne({
        name: 'gabriel',
        email: 'gabrielluislopes00@gmail.com',
        password: '1234',
        accessToken: 'any_token',
        role: 'any_role'
      })
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('gabriel')
      expect(account.email).toBe('gabrielluislopes00@gmail.com')
      expect(account.password).toBe('1234')
    })

    test('Should return null if loadByToken fails', async () => {
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
