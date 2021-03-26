import { AddSurveyRepository } from '@data/interfaces/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@data/interfaces/db/survey/load-survey-by-id-repository'
import { LoadSurveyRepository } from '@data/interfaces/db/survey/load-survey-repository'
import { SurveyModel } from '@domain/models/survey'
import { AddSurveyParams } from '@domain/usecases/add-survey'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { QueryBuilder } from '../helpers/query-bulder'

export class MongoSurveyRepository
implements AddSurveyRepository, LoadSurveyRepository, LoadSurveyByIdRepository {
  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResult',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: { $eq: ['$$item.accountId', new ObjectId(accountId)] }
                }
              }
            },
            1
          ]
        }
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
