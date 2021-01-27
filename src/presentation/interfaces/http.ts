export interface HttpRequest<T = any, H = any> {
  body?: T
  headers?: H
}

export interface HttpResponse<T = any> {
  statusCode: number
  body: T
}
