import { Controller } from '@presentation/interfaces/controller'
import { AddSurveyController } from '@presentation/controllers/survey/add-survey/add-survey'
import { makeLogController } from '../decorators/log-controller-factory'
import { makeAddSurveyValidation } from './add-survey-validations-factory'
import { makeDbAddSurvey } from '../usecases/ad-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  )
  return makeLogController(controller)
}
