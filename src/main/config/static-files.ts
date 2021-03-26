import express, { Express } from 'express'
import { resolve } from 'path'

export default (app: Express): void => {
  app.use('/api/static', express.static(resolve(__dirname, '..', '..', 'static')))
}
