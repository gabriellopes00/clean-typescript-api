import { DbLoadSurvey } from '@data/usecases/load-survey/db-load-survey'
import { LoadSurvey } from '@domain/usecases/load-survey'
import { MongoSurveyRepository } from '@infra/db/mongodb/survey/mongo-survey-repository'

export const makeDbLoadSurvey = (): LoadSurvey => {
  const mongoSurveyRepository = new MongoSurveyRepository()
  return new DbLoadSurvey(mongoSurveyRepository)
}
