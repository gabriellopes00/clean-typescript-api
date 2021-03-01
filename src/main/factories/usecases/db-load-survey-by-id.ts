import { DbLoadSurveyById } from '@data/usecases/load-survey-by-id/load-survey-by-id'
import { LoadSurveyById } from '@domain/usecases/load-survey'
import { MongoSurveyRepository } from '@infra/db/mongodb/survey/mongo-survey-repository'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const mongoSurveyRepository = new MongoSurveyRepository()
  return new DbLoadSurveyById(mongoSurveyRepository)
}
