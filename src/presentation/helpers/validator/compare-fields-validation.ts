import { Validation } from '../../interfaces/validation'
import { InvalidParamError } from '../../errors'

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly filedToCompare: string
  ) {}

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.filedToCompare]) {
      return new InvalidParamError(this.filedToCompare)
    }
  }
}
