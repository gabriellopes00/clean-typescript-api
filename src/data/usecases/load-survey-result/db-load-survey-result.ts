import { SurveyResultsModel } from '@domain/models/survey-results'
import { LoadSurveyResult } from '@domain/usecases/load-survey-results'
import { LoadSurveyResultRepository } from '@data/interfaces/db/survey/load-survey-results-repository'
import { LoadSurveyByIdRepository } from '@data/interfaces/db/survey/load-survey-by-id-repository'

export class DbLoadSurveyResults implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string, accountId: string): Promise<SurveyResultsModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        date: survey.date,
        question: survey.question,
        answers: survey.answers.map(answer =>
          Object.assign({}, answer, { count: 0, percent: 0, isCurrentAccountResponse: false })
        )
      }
    }
    return surveyResult
  }
}
