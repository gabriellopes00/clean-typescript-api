import { Router } from 'express'
import { adaptRoutes } from '../adapters/express-routes'
import { makeSaveSurveyResultController } from '@main/factories/save-survey-result/save-survey-result-controller'
import { Auth } from '@main/middlewares/auth'

const saveSurveyResultController = makeSaveSurveyResultController()

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', Auth, adaptRoutes(saveSurveyResultController))
}
