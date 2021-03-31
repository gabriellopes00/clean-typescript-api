import { adaptResolver } from '@main/adapters/apollo-server-resolver-adapter'
import { makeLoginController } from '@main/factories/login/login-factory'
import { makeSignUpController } from '@main/factories/signup/signup-factory'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  },

  Mutation: {
    signup: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args)
  }
}
