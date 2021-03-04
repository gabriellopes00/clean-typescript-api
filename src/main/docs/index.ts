import { badRequest } from './components/bad-request'
import { forbidden } from './components/forbidden'
import { notFound } from './components/not-found'
import { serverError } from './components/server-error'
import { unauthorized } from './components/unauthorized'
import { loginPath } from './paths/login-path'
import { signUpPath } from './paths/signup-path'
import { surveysPath } from './paths/surveys-path'
import { accountSchema } from './schemas/account-schema'
import { addSurveySchema } from './schemas/add-survey-schema'
import { apiKeyAuthSchema } from './schemas/api-key-auth-schema'
import { errorSchema } from './schemas/error-schema'
import { loginSchema } from './schemas/login-schema'
import { signUpSchema } from './schemas/signup-schema'
import { surveyAnswerSchema } from './schemas/survey-answer-schema'
import { surveySchema } from './schemas/survey-schema'
import { surveysSchema } from './schemas/surveys-schema'

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
  tags: [{ name: 'Login' }, { name: 'Surveys' }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveysPath
  },
  schemas: {
    account: accountSchema,
    login: loginSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    signup: signUpSchema,
    addSurvey: addSurveySchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest: badRequest,
    serverError: serverError,
    unauthorized: unauthorized,
    notFound: notFound,
    forbidden: forbidden
  }
}
