import { Router } from 'express'
import { adaptRoutes } from '../adapters/express-routes'
import { makeAddSurveyController } from '@main/factories/add-survey/add-survey-controller-factory'

const addSurveyController = makeAddSurveyController()

export default (router: Router): void => {
  router.post('/surveys', adaptRoutes(addSurveyController))
}
