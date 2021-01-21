import { InvalidParamError } from '../../../presentation/errors'
import { CompareFieldsValidation } from '../compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_field',
      fieldToCompare: 'wrong_field'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_field',
      fieldToCompare: 'any_field'
    })
    expect(error).toBeFalsy()
  })
})
