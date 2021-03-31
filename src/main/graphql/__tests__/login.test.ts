import { gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import { fakeAccountParams } from '../../../domain/mocks/mock-account'
import { MongoHelper } from '../../../infra/db/mongodb/helpers'
import { makeApolloServer } from './helpers'

describe('Login GraphQL', () => {
  let accountCollection: Collection
  const apolloServer = makeApolloServer()

  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
      query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          name
        }
      }
    `
    test('Should return an account on valid credentials', async () => {
      const hashedPassword = await hash(fakeAccountParams.password, 12)
      await accountCollection.insertOne({ ...fakeAccountParams, password: hashedPassword })

      const { query } = createTestClient({ apolloServer })
      const response: any = await query(loginQuery, {
        variables: {
          email: fakeAccountParams.email,
          password: fakeAccountParams.password
        }
      })
      expect(response.data.login.accessToken).toBeTruthy()
    })

    test('Should return an unauthorized on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const response: any = await query(loginQuery, {
        variables: {
          email: fakeAccountParams.email,
          password: fakeAccountParams.password
        }
      })
      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Unauthorized error')
    })
  })
})
