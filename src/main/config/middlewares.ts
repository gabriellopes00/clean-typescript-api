import { Express } from 'express'
import { bodyParser } from '../middlewares/bodyParser'

export default (app: Express): void => {
  app.use(bodyParser)
}
