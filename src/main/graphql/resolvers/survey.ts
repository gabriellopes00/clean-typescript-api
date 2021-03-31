import { adaptResolver } from '@main/adapters/apollo-server-resolver-adapter'
import { makeLoadSurveysController } from '@main/factories/load-survey/load-survey-controller'

export default {
  Query: {
    surveys: async () => adaptResolver(makeLoadSurveysController())
  }
}
