import { makeAuthMiddleware } from '@main/factories/middlewares/auth-middleware'
import { ForbiddenError } from 'apollo-server-errors'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>): any {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async (parent, args, context, info) => {
      const request = { accessToken: context?.req?.headers?.['access-token'] }
      const response = await makeAuthMiddleware().handle(request)
      if (response.statusCode === 200) {
        Object.assign(context?.req, response.body)
        return resolve.call(this, parent, args, context, info)
      } else throw new ForbiddenError(response.body.message)
    }
  }
}
