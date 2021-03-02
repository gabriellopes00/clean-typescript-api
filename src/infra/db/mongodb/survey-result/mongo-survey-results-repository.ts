import { SaveSurveyResultsRepository } from '@data/interfaces/db/survey/save-survey-result-repository'
import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResultParams } from '@domain/usecases/save-survey-results'
import { MongoHelper } from '../helpers/mongo'

export class MongoSurveyResultRepository implements SaveSurveyResultsRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultsModel> {
    const surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    const result = await surveyResultsCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId },
      { $set: { answer: data.answer, date: data.date } },
      { upsert: true, returnOriginal: false }
    )
    return result.value && MongoHelper.map(result.value)
  }
}
