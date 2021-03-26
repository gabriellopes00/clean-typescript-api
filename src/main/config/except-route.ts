import { Express } from 'express'

export default (app: Express) => {
  app.use((req, res, next) => {
    res.status(404).json({
      message:
        "Sorry, this route doesn't exists. See documentation at https://clean-typescript-api.herokuapp.com/api/docs"
    })
  })
}
