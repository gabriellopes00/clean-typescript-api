import { SaveSurveyResultController } from '@presentation/controllers/survey-result/save-survey-result-controller'
import { Controller } from '../../../presentation/interfaces/controller'
import { makeLogController } from '../decorators/log-controller-factory'
import { makeDbLoadSurveyById } from '../usecases/db-load-survey-by-id'
import { makeDbSaveSurveyResult } from '../usecases/db-save-survey-result-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )
  return makeLogController(controller)
}
