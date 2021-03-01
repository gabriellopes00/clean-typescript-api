export interface HttpRequest<T = any, H = any, P = any> {
  body?: T
  headers?: H
  params?: P
}

export interface HttpResponse<T = any> {
  statusCode: number
  body: T
}
