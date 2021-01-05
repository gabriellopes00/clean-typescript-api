import { Controller, HttpResponse, HttpRequest } from '@presentation/interfaces'
import { LogControllerDecorator } from './log'
import { serverError, ok } from '@presentation/helpers/http/http'
import { LogErrorRepository } from '@data/interfaces/log-error-repository'
import { AccountModel } from '@domain/models/account'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'gabriel',
    email: 'gabriel@example.com',
    password: 'gabriel123'
  }
})
const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email',
  password: 'valid-password'
})
const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'error_stack'
  return serverError(fakeError)
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stackError: string): Promise<void> {
      return new Promise((resolve, reject) => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve, reject) => resolve(ok(makeFakeAccount())))
    }
  }
  return new ControllerStub()
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogError with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => resolve(makeFakeServerError()))
      )
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('error_stack')
  })
})
