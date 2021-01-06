export interface AccessTokenRepository {
  store(id: string, token: string): Promise<void>
}
