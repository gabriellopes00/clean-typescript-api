import { Router } from 'express'
import { adaptRoutes } from '../adapters/express-routes'
import { makeAddSurveyController } from '@main/factories/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth-middleware'
import { adaptMiddleware } from '../adapters/express-middleware'

const addSurveyController = makeAddSurveyController()

export default (router: Router): void => {
  const admAuthentication = adaptMiddleware(makeAuthMiddleware('adm'))
  router.post('/surveys', admAuthentication, adaptRoutes(addSurveyController))
}
