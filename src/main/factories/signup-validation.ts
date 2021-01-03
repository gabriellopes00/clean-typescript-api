import { ValidationComposite } from '@presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '@presentation/helpers/validator/required-fields-validation'

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password')
  ])
}
