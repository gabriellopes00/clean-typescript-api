import { Collection } from 'mongodb'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo'
import { MongoSurveyRepository } from './mongo-survey-repository'

const makeSurveyFakeData = (): AddSurveyModel => ({
  date: new Date(),
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'answer'
    }
  ]
})

const fakeSurveys: SurveyModel[] = [
  {
    id: 'asdf',
    date: new Date(),
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  },
  {
    id: 'fdsa',
    date: new Date(),
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ]
  }
]

const makeSut = () => {
  const sut = new MongoSurveyRepository()
  return { sut }
}

let surveyCollection: Collection

describe('Survey Mongodb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('AddSurvey', () => {
    test('Should add a survey on success', async () => {
      const { sut } = makeSut()
      await sut.add(makeSurveyFakeData())
      const survey = await surveyCollection.findOne({
        question: 'any_question'
      })
      expect(survey).toBeTruthy()
    })
  })

  describe('LoadAllSurveys', () => {
    test('Should load all surveys on success', async () => {
      const { sut } = makeSut()
      await surveyCollection.insertMany(fakeSurveys)
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBe('asdf')
      expect(surveys[1].id).toBe('fdsa')
    })

    test('Should load an empty list if there are not surveys registered', async () => {
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
      expect(surveys).toBeInstanceOf(Array)
    })
  })

  describe('LoadSurveyById', () => {
    test('Should load a survey by id on success', async () => {
      const response = await surveyCollection.insertOne({
        date: new Date(),
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ]
      })
      const { sut } = makeSut()
      const survey = await sut.loadById(response.ops[0].id)
      expect(survey).toBeTruthy()
      expect(survey.question).toBe('any_question')
    })
  })
})
