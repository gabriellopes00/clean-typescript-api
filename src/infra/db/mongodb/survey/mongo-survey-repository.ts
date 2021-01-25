import { AddSurveyRepository } from '@data/interfaces/db/survey/add-survey-repository'
import { AddSurveyModel } from '@domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo'

export class MongoSurveyRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
