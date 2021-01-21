import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validator/required-fields-validation'
import { Validation } from '../../../presentation/interfaces/validation'
import { CompareFieldsValidation } from '../../../validation/validator/compare-fields-validation'
import { EmailValidation } from '../../../validation/validator/email-validation'
import { EmailValidator } from '../../../validation/interfaces/email-validator'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../validation/validator/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation factory', () => {
  test('Should call ValidationComposite with correct validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
