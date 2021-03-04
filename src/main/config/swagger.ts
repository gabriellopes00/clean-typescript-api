import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerConfig from '../docs/index'
import { noCache } from '@main/middlewares/no-cache'

export default (app: Express) => {
  app.use('/api/docs', noCache, serve, setup(swaggerConfig))
}
