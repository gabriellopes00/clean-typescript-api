export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
}

export interface AuthenticationModel {
  accessToken: string
  name: string
}
