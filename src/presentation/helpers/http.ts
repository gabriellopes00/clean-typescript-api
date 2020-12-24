import { MissingParamError, ServerError } from '@presErrors/index'
import { HttpResponse } from '@presInterfaces/http'

export const badRequest = (error: MissingParamError): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
