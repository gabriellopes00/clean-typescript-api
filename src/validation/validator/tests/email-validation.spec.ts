import { InvalidParamError } from '../../../presentation/errors'
import { EmailValidator } from '../../interfaces/email-validator'
import { EmailValidation } from '../email-validation'

class MockEmailValidation implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

describe('EmailValidation', () => {
  const mockEmailValidation = new MockEmailValidation() as jest.Mocked<MockEmailValidation>
  const sut = new EmailValidation('email', mockEmailValidation)

  test('Should return an error if EmailValidator returns false', () => {
    jest.spyOn(mockEmailValidation, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'gabriel@example.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const isValidSpy = jest.spyOn(mockEmailValidation, 'isValid')
    sut.validate({ email: 'gabriel@example.com' })
    expect(isValidSpy).toHaveBeenCalledWith('gabriel@example.com')
  })

  test('Should throw if EmailValidator throws', () => {
    jest.spyOn(mockEmailValidation, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
