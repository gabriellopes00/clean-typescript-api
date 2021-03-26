import express from 'express'
import Middlewares from '../config/middlewares'
import Routes from '../config/routes'
import Swagger from './swagger'
import StaticFiles from './static-files'
// import ExceptRoute from './except-route'

const app = express()
// ExceptRoute(app)
StaticFiles(app)
Swagger(app)
Middlewares(app)
Routes(app)

export default app
