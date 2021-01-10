import { ValidationComposite } from '@presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '@presentation/helpers/validator/required-fields-validation'
import { Validation } from '@presentation/interfaces/validation'
import { EmailValidation } from '@presentation/helpers/validator/email-validation'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
