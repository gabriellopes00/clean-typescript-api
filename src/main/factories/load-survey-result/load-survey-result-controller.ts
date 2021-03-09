import { LoadSurveyResultController } from '@presentation/controllers/survey-result/load-survey-result-controller'
import { Controller } from '../../../presentation/interfaces/controller'
import { makeLogController } from '../decorators/log-controller-factory'
import { makeDbLoadSurveyById } from '../usecases/db-load-survey-by-id'
import { makeDbLoadSurveyResult } from '../usecases/db-load-survey-result'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbLoadSurveyResult()
  )
  return makeLogController(controller)
}
