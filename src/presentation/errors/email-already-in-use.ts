export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('The received email is already in use')
    this.name = 'EmailAlreadyInUseError'
  }
}
