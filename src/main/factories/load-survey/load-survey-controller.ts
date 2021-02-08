import { Controller } from '../../../presentation/interfaces/controller'
import { LoadSurveyController } from '../../../presentation/controllers/survey/load-survey/load-survey-controller'
import { makeLogController } from '../decorators/log-controller-factory'
import { makeDbLoadSurvey } from '../usecases/db-load-survey'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveyController(makeDbLoadSurvey())
  return makeLogController(controller)
}
