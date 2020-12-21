import { MongoHelper } from '@infra/db/mongodb/helpers/index'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    console.log(`Mongodb connected successfully at ${env.mongoUrl}`)

    const app = (await import('./config/app')).default
    const port = env.port

    app.listen(port, () => {
      console.log('Server running at http://localhost:' + port)
    })
  })
  .catch(err => console.error(err))
