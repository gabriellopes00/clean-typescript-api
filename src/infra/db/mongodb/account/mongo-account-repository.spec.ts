import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { MongoAccountRepository } from './mongo-account-repository'

describe('Account Mongodb Repository', () => {
  const sut = new MongoAccountRepository()
  let accountCollection: Collection
  const fakeAccount = { name: 'any_name', email: 'any@mail.com', password: 'any_password' }

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
      const account = await sut.add(fakeAccount)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any@mail.com')
    })
  })

  describe('LoadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      accountCollection.insertOne({ ...fakeAccount })
      const account = await sut.loadByEmail('any@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any@mail.com')
    })

    test('Should return null if loadByEmail fails', async () => {
      const account = await sut.loadByEmail('any@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('AccessToken', () => {
    test('Should create the account accessToken on AccessTokenSuccess', async () => {
      const result = await accountCollection.insertOne({ ...fakeAccount })
      const newAccount = result.ops[0]
      expect(newAccount.accessToken).toBeFalsy()

      await sut.storeAccessToken(newAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: newAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBeTruthy()
    })
  })

  describe('LoadByToken', () => {
    test('Should return an account on loadByToken success without role', async () => {
      accountCollection.insertOne({ ...fakeAccount, accessToken: 'any_token' })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any@mail.com')
    })

    test('Should return an account on loadByToken success with role', async () => {
      accountCollection.insertOne({ ...fakeAccount, accessToken: 'any_token', role: 'any_role' })
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any@mail.com')
    })

    test('Should return an account on loadByToken success with adm role', async () => {
      accountCollection.insertOne({ ...fakeAccount, accessToken: 'any_token', role: 'adm' })
      const account = await sut.loadByToken('any_token', 'adm')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any@mail.com')
    })

    test('Should return null on loadByToken success with invalid role', async () => {
      accountCollection.insertOne({ ...fakeAccount, accessToken: 'any_token' })
      const account = await sut.loadByToken('any_token', 'adm')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken success if user is adm', async () => {
      accountCollection.insertOne({ ...fakeAccount, accessToken: 'any_token', role: 'adm' })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any@mail.com')
    })

    test('Should return null if loadByToken fails', async () => {
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
