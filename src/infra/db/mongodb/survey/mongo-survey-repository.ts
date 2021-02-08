import { AddSurveyRepository } from '@data/interfaces/db/survey/add-survey-repository'
import { LoadSurveyRepository } from '@data/interfaces/db/survey/load-survey-repository'
import { SurveyModel } from '@domain/models/survey'
import { AddSurveyModel } from '@domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo'

export class MongoSurveyRepository
implements AddSurveyRepository, LoadSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    return surveyCollection.find().toArray()
  }
}
