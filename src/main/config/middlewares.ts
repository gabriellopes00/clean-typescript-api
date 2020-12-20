import { Express } from 'express'

import { bodyParser, contentType, cors } from '../middlewares/index'
export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
