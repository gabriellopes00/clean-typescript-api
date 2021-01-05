export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authenticator {
  authenticate(data: AuthenticationModel): Promise<string>
}
