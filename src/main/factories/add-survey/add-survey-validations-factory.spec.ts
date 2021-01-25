import { ValidationComposite } from '../../../validation/validator/validation-composite'
import { RequiredFieldValidation } from '../../../validation/validator/required-fields-validation'
import { Validation } from '../../../presentation/interfaces/validation'
import { makeAddSurveyController } from './add-survey-controller-factory'

jest.mock('../../../validation/validator/validation-composite')

describe('AddSurveyValidation factory', () => {
  test('Should call ValidationComposite with correct validations', () => {
    makeAddSurveyController()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
