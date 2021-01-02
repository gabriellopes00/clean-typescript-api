export interface Authenticator {
  authenticate(email: string, password: string): Promise<string>
}
