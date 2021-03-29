import { Controller, HttpResponse } from '@presentation/interfaces'
import { LogErrorRepository } from '@data/interfaces/db/log/log-error-repository'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
