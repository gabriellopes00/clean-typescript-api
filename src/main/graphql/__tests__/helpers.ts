import { ApolloServer } from 'apollo-server-express'
import resolvers from '../resolvers'
import typeDefs from '../type-defs'
import schemaDirectives from '../directives'

export const makeApolloServer = (): ApolloServer =>
  new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives
  })

describe('', () => {
  test('', () => {
    expect(1).toBe(1)
  })
})
