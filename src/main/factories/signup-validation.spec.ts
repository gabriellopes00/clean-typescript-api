import { ValidationComposite } from '@presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '@presentation/helpers/validator/required-fields-validation'
import { Validation } from '@root/src/presentation/interfaces/validator/validation'
import { makeSignUpValidation } from './signup-validation'

jest.mock('@presentation/helpers/validator/validation-composite')

describe('SignUpValidation factory', () => {
  test('Should call ValidationComposite with correct validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
