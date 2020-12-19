import express from 'express'
import Middlewares from '../config/middlewares'

const app = express()
Middlewares(app)

export { app }
