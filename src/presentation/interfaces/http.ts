export interface HttpRequest<T = any, H = any, P = any, A = any> {
  body?: T
  headers?: H
  params?: P
  accountId?: A
}

export interface HttpResponse<T = any> {
  statusCode: number
  body: T
}
