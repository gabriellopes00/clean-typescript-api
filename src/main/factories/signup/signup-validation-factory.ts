import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validator/required-fields-validation'
import { Validation } from '@presentation/interfaces/validation'
import { CompareFieldsValidation } from '../../../validation/validator/compare-fields-validation'
import { EmailValidation } from '../../../validation/validator/email-validation'
import { EmailValidatorAdapter } from '@infra/validation/email-validator-adapter'

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
