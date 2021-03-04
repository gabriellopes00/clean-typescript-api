import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { loginSchema } from './schemas/login-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Typescript API',
    description: 'An API made with Node.JS, Typescript and MongoDB',
    version: '1.5.0'
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    login: loginSchema
  }
}
