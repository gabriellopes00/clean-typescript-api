import { ValidationComposite } from '@presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '@presentation/helpers/validator/required-fields-validation'
import { Validation } from '@presentation/interfaces/validator/validation'
import { makeSignUpValidation } from './signup-validation'
import { CompareFieldsValidation } from '@presentation/helpers/validator/compare-fields-validation'

jest.mock('@presentation/helpers/validator/validation-composite')

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

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
