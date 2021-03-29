import { LogErrorRepository } from '../../data/interfaces/db/log/log-error-repository'
import { fakeAccountModel, fakeAccountParams } from '../../domain/mocks/mock-account'
import { ok, serverError } from '../../presentation/helpers/http/http'
import { Controller, HttpResponse } from '../../presentation/interfaces'
import { LogControllerDecorator } from './log-controller-decorator'

const fakeRequest = fakeAccountParams

const fakeError = new Error()
fakeError.stack = 'error_stack'
const fakeServerError = serverError(fakeError)

class MockLogErrorRepository implements LogErrorRepository {
  async logError(stackError: string): Promise<void> {
    return new Promise(resolve => resolve())
  }
}

class MockController implements Controller {
  async handle(httpRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(ok(fakeAccountModel)))
  }
}

describe('LogController Decorator', () => {
  const mockController = new MockController() as jest.Mocked<MockController>
  const mockLogErrorRepository = new MockLogErrorRepository() as jest.Mocked<MockLogErrorRepository>
  const sut = new LogControllerDecorator(mockController, mockLogErrorRepository)

  test('Should call controller handle', async () => {
    const handleSpy = jest.spyOn(mockController, 'handle')
    await sut.handle(fakeRequest)
    expect(handleSpy).toHaveBeenCalledWith(fakeRequest)
  })

  test('Should return the same result of the controller', async () => {
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(ok(fakeAccountModel))
  })

  test('Should call LogError with correct error if controller returns a server error', async () => {
    const logSpy = jest.spyOn(mockLogErrorRepository, 'logError')
    mockController.handle.mockResolvedValueOnce(fakeServerError)
    await sut.handle(fakeRequest)
    expect(logSpy).toHaveBeenCalledWith('error_stack')
  })
})
