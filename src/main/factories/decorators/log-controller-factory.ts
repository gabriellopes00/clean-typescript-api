import { Controller } from '@presentation/interfaces/controller'
import { MongoLogRepository } from '@infra/db/mongodb/log/mongo-log-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogController = (controller: Controller): Controller => {
  const mongoLogRepository = new MongoLogRepository()

  return new LogControllerDecorator(controller, mongoLogRepository)
}
