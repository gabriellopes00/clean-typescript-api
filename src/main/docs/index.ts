import { badRequest } from './components/bad-request'
import { notFound } from './components/not-found'
import { serverError } from './components/server-error'
import { unauthorized } from './components/unauthorized'
import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { errorSchema } from './schemas/error-schema'
import { loginSchema } from './schemas/login-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Typescript API',
    description: 'An API made with Node.JS, Typescript and MongoDB',
    version: '1.5.0'
  },
  license: {
    name: 'MIT',
    url: 'https://github.com/gabriellopes00/clean-typescript-api/blob/main/LICENSE.md'
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    login: loginSchema,
    error: errorSchema
  },
  components: {
    badRequest: badRequest,
    serverError: serverError,
    unauthorized: unauthorized,
    notFound: notFound
  }
}
