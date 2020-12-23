import { Controller, HttpResponse, HttpRequest } from '@presentation/interfaces'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
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

    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const sut = new LogControllerDecorator(controllerStub)
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
})
