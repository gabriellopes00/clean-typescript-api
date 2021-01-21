import { Validation } from '../../presentation/interfaces/validation'
import { InvalidParamError } from '../../presentation/errors'

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
