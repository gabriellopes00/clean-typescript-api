import { DbAddSurvey } from '@data/usecases/add-survey/db-add-survey'
import { MongoSurveyRepository } from '@infra/db/mongodb/survey/mongo-survey-repository'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const mongoSurveyRepository = new MongoSurveyRepository()
  return new DbAddSurvey(mongoSurveyRepository)
}
