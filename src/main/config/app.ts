import express from 'express'
import Middlewares from '../config/middlewares'
import Routes from '../config/routes'

const app = express()
Middlewares(app)
Routes(app)

export { app }
