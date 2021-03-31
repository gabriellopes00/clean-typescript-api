import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/type-defs'
import { GraphQLError } from 'graphql'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    if (validateError(error, 'AuthenticationError')) response.http.status = 401
    else if (validateError(error, 'ForbiddenError')) response.http.status = 403
    else if (validateError(error, 'UserInputError')) response.http.status = 400
    else response.http.status = 500
  })
}

const validateError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

export default (app: Express) => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [
      {
        requestDidStart: () => ({
          willSendResponse: ({ response, errors }) => handleErrors(response, errors)
        })
      }
    ]
  })
  server.applyMiddleware({ app })
}
