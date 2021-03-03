import { MissingParamError } from '../../../presentation/errors'
import { RequiredFieldValidation } from '../required-fields-validation'

describe('RequiredField Validation', () => {
  const sut = new RequiredFieldValidation('field')

  test('Should return a MissingParamError if validation fails', () => {
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
