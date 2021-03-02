export interface AuthenticationParams {
  email: string
  password: string
}

export interface Authenticator {
  authenticate(data: AuthenticationParams): Promise<string>
}
