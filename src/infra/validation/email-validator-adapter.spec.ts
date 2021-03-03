import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  const sut = new EmailValidatorAdapter()

  test('Should return false if validator return false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValidEmail = sut.isValid('invalid_email@gmail.com')
    expect(isValidEmail).toBe(false)
  })

  test('Should return true if validator return true', () => {
    const isValidEmail = sut.isValid('valid_email@gmail.com')
    expect(isValidEmail).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@gmail.com')
  })
})
