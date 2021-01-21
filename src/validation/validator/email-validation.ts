import { Validation } from '../../presentation/interfaces/validation'
import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../interfaces/email-validator'

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
