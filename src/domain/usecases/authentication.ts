import { AuthenticationModel } from '@domain/models/account'

export interface AuthenticationParams {
  email: string
  password: string
}

export interface Authenticator {
  authenticate(data: AuthenticationParams): Promise<AuthenticationModel>
}
