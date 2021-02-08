import { Router } from 'express'
import { adaptRoutes } from '../adapters/express-routes'
import { makeAddSurveyController } from '@main/factories/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@main/factories/load-survey/load-survey-controller'
import { AdmAuth } from '@main/middlewares/adm-auth'
import { Auth } from '@main/middlewares/auth'

const addSurveyController = makeAddSurveyController()
const loadSurveyController = makeLoadSurveysController()

export default (router: Router): void => {
  router.post('/surveys', AdmAuth, adaptRoutes(addSurveyController))
  router.get('/surveys', Auth, adaptRoutes(loadSurveyController))
}
