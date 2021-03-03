import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validator/required-fields-validation'
import { Validation } from '../../../presentation/interfaces/validation'
import { EmailValidation } from '../../../validation/validator/email-validation'
import { EmailValidator } from '../../../validation/interfaces/email-validator'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../validation/validator/validation-composite')

class MockEmailValidation implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

describe('LoginValidation factory', () => {
  const mockEmailValidation = new MockEmailValidation()

  test('Should call ValidationComposite with correct validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidation))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
