import { Validation } from '../../interfaces/validator/validation'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../interfaces/emailValidator'

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
    if (!isValidEmail) return new InvalidParamError(this.fieldName)
  }
}
