import { adaptResolver } from '@main/adapters/apollo-server-resolver-adapter'
import { makeLoginController } from '@main/factories/login/login-factory'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  }
}
