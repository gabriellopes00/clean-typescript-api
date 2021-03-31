import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/type-defs'

export default (app: Express) => {
  const server = new ApolloServer({ resolvers, typeDefs })
  server.applyMiddleware({ app })
}
