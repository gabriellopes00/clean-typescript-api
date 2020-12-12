export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`MissingParamError: ${paramName}`)
    this.name = paramName
  }
}
