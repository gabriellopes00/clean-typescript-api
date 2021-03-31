import { gql } from 'apollo-server-express'

export default gql`
  type SurveyResult {
    surveyId: String!
    question: String!
    date: DateTime!
    answers: [Answer!]!
    didAnswer: Boolean
  }

  type Answer {
    image: String
    answer: String!
    count: Int!
    percent: Int!
    isCurrentAccountResponse: Boolean!
  }

  extend type Query {
    surveyResult(surveyId: String!): SurveyResult! @auth
  }

  extend type Mutation {
    saveSurveyResult(surveyId: String!, answer: String!): SurveyResult! @auth
  }
`
