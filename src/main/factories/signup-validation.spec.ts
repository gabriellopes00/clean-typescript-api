import { ValidationComposite } from '@presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '@presentation/helpers/validator/required-fields-validation'
import { Validation } from '@presentation/interfaces/validation'
import { CompareFieldsValidation } from '@presentation/helpers/validator/compare-fields-validation'
import { EmailValidation } from '@presentation/helpers/validator/email-validation'
import { EmailValidator } from '@presentation/interfaces/emailValidator'
import { makeSignUpValidation } from './signup-validation'

jest.mock('@presentation/helpers/validator/validation-composite')

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
