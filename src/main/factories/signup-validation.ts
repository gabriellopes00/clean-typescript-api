import { ValidationComposite } from '@presentation/helpers/validator/validation-composite'
import { RequiredFieldValidation } from '@presentation/helpers/validator/required-fields-validation'
import { Validation } from '@presentation/interfaces/validator/validation'
import { CompareFieldsValidation } from '@presentation/helpers/validator/compare-fields-validation'
import { EmailValidation } from '@presentation/helpers/validator/email-validation'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
