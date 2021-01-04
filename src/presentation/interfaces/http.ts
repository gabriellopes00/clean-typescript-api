export interface HttpRequest<T = any> {
  body?: T
}

export interface HttpResponse<T = any> {
  statusCode: number
  body: T
}
