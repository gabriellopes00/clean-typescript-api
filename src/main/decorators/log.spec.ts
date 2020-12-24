import { Controller, HttpResponse, HttpRequest } from '@presentation/interfaces'
import { LogControllerDecorator } from './log'
import { serverError } from '@presentation/helpers/http'
import { LogErrorRepository } from '@data/interfaces/logErrorRepository'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stackError: string): Promise<void> {
      return new Promise((resolve, reject) => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          email: 'gabriel@example.com',
          name: 'Gabriel Lopes',
          password: 'gabriel123'
        }
      }
      return new Promise((resolve, reject) => resolve(httpResponse))
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
    const httpRequest: HttpRequest = {
      body: {
        email: 'gabriel@example.com',
        name: 'Gabriel Lopes',
        password: 'gabriel123'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'gabriel@example.com',
        name: 'Gabriel Lopes',
        password: 'gabriel123'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Gabriel Lopes',
        email: 'gabriel@example.com',
        password: 'gabriel123'
      }
    })
  })

  test('Should call LogError with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'error_stack'
    const error = serverError(fakeError)

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(error)))
    const httpRequest: HttpRequest = {
      body: {
        email: 'gabriel@example.com',
        name: 'Gabriel Lopes',
        password: 'gabriel123'
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('error_stack')
  })
})
