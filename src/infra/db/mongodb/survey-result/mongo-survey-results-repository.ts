import { LoadSurveyResultRepository } from '@data/interfaces/db/survey/load-survey-results-repository'
import { SaveSurveyResultsRepository } from '@data/interfaces/db/survey/save-survey-result-repository'
import { SurveyResultsModel } from '@domain/models/survey-results'
import { SaveSurveyResultParams } from '@domain/usecases/save-survey-results'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { QueryBuilder } from '../helpers/query-bulder'

export class MongoSurveyResultRepository
implements SaveSurveyResultsRepository, LoadSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate(
      { surveyId: new ObjectId(data.surveyId), accountId: new ObjectId(data.accountId) },
      { $set: { answer: data.answer, date: data.date } },
      { upsert: true }
    )
  }

  async loadBySurveyId(surveyId: string): Promise<SurveyResultsModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({ _id: 0, data: { $push: '$$ROOT' }, total: { $sum: 1 } })
      .unwind({ path: '$data' })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({ path: '$survey' })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: { $sum: 1 }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: { $eq: ['$$item.answer', '$_id.answer'] },
                      then: '$count',
                      else: 0
                    }
                  },
                  percent: {
                    $cond: {
                      if: { $eq: ['$$item.answer', '$_id.answer'] },
                      then: {
                        $multiply: [{ $divide: ['$count', '$_id.total'] }, 100]
                      },
                      else: 0
                    }
                  }
                }
              ]
            }
          }
        }
      })
      .group({
        _id: { surveyId: '$surveyId', question: '$question', date: '$date' },
        answers: { $push: '$answers' }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] }
          }
        }
      })
      .unwind({ path: '$answers' })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: { $sum: '$answers.count' },
        percent: { $sum: '$answers.percent' }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent'
        }
      })
      .sort({ 'answer.count': -1 })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: { $push: '$answer' }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()

    const surveyResult = await surveyResultCollection.aggregate(query).toArray()
    return surveyResult.length ? surveyResult[0] : null
  }
}
