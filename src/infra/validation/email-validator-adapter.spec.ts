import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('EmailValidator Adapter', () => {
  test('Should return false if validator return false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValidEmail = sut.isValid('invalid_email@gmail.com')
    expect(isValidEmail).toBe(false)
  })

  test('Should return true if validator return true', () => {
    const sut = makeSut()
    const isValidEmail = sut.isValid('valid_email@gmail.com')
    expect(isValidEmail).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@gmail.com')
  })
})
