import { DbSaveSurveyResults } from '@data/usecases/save-survey-result/db-save-survey-result'
import { SaveSurveyResults } from '@domain/usecases/save-survey-results'
import { MongoSurveyResultRepository } from '@infra/db/mongodb/survey-result/mongo-survey-results-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResults => {
  const mongoSurveyResultRepository = new MongoSurveyResultRepository()
  return new DbSaveSurveyResults(mongoSurveyResultRepository, mongoSurveyResultRepository)
}
