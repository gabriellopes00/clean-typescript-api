export interface AccessTokenRepository {
  storeAccessToken(id: string, token: string): Promise<void>
}
