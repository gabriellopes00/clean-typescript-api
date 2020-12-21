import { Router } from 'express'
import { makeSignUpController } from '../factories/signup'

const SignUpController = makeSignUpController()

export default (router: Router): void => {
  router.post('/signup', SignUpController.handle)
}
