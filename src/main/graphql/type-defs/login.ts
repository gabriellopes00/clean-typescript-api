import { gql } from 'apollo-server-express'

export default gql`
  type Account {
    accessToken: String!
    name: String!
  }

  extend type Query {
    login(email: String!, password: String!): Account!
  }

  extend type Mutation {
    signup(
      email: String!
      name: String!
      password: String!
      passwordConfirmation: String!
    ): Account!
  }
`
