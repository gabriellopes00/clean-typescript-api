import express from 'express'
import Middlewares from '../config/middlewares'
import Routes from '../config/routes'
import Swagger from './swagger'

const app = express()
Swagger(app)
Middlewares(app)
Routes(app)

export default app
