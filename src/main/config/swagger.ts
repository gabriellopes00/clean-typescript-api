import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerConfig from '../docs/index'

export default (app: Express) => {
  app.use('/api/docs', serve, setup(swaggerConfig))
}
