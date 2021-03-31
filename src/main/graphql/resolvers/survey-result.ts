import { adaptResolver } from '@main/adapters/apollo-server-resolver-adapter'
import { makeLoadSurveyResultController } from '@main/factories/load-survey-result/load-survey-result-controller'
import { makeSaveSurveyResultController } from '@main/factories/save-survey-result/save-survey-result-controller'

export default {
  Query: {
    surveyResult: async (parent: any, args: any) =>
      adaptResolver(makeLoadSurveyResultController(), args)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any) =>
      adaptResolver(makeSaveSurveyResultController(), args)
  }
}
