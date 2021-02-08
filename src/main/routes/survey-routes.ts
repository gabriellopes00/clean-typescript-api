import { Router } from 'express'
import { adaptRoutes } from '../adapters/express-routes'
import { makeAddSurveyController } from '@main/factories/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth-middleware'
import { adaptMiddleware } from '../adapters/express-middleware'
import { makeLoadSurveysController } from '@main/factories/load-survey/load-survey-controller'

const addSurveyController = makeAddSurveyController()
const loadSurveyController = makeLoadSurveysController()

export default (router: Router): void => {
  const admAuthentication = adaptMiddleware(makeAuthMiddleware('adm'))
  const auth = adaptMiddleware(makeAuthMiddleware())

  router.post('/surveys', admAuthentication, adaptRoutes(addSurveyController))
  router.get('/surveys', auth, adaptRoutes(loadSurveyController))
}
