import { DbLoadSurveyResults } from '@data/usecases/load-survey-result/db-load-survey-result'
import { LoadSurveyResult } from '@domain/usecases/load-survey-results'
import { MongoSurveyResultRepository } from '@infra/db/mongodb/survey-result/mongo-survey-results-repository'
import { MongoSurveyRepository } from '@infra/db/mongodb/survey/mongo-survey-repository'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const mongoSurveyResultRepository = new MongoSurveyResultRepository()
  const mongoSurveyRepository = new MongoSurveyRepository()
  return new DbLoadSurveyResults(mongoSurveyResultRepository, mongoSurveyRepository)
}
