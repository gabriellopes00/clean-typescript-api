import { SignUpController } from './SignUp'
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel
} from './signup-interfaces'
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from '../../errors/index'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()

  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SingUp Controller', () => {
  // Data validation tests
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'gabriel@example.com',
        password: 'gabriel123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'gabriel',
        password: 'gabriel123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'gabriel',
        email: 'gabriel@example.com'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'gabriel',
        email: 'gabriel@example.com',
        password: 'gabriel123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'gabriel',
        email: 'gabriellopes00@gmail.com',
        password: 'gabriel123'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('gabriellopes00@gmail.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'gabriel',
        email: 'gabriel@example.com',
        password: 'gabriel123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  // AddAccount integration tests
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'gabriel',
        email: 'gabriellopes00@gmail.com',
        password: 'gabriel123'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'gabriel',
      email: 'gabriellopes00@gmail.com',
      password: 'gabriel123'
    })
  })

  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'gabriel',
        email: 'gabriel@example.com',
        password: 'gabriel123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'gabriel',
        email: 'gabriel@example.com',
        password: 'gabriel123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    })
  })
})
