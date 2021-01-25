import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validator/required-fields-validation'
import { Validation } from '@presentation/interfaces/validation'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
