export interface AuthTokenResponse {
  accessToken: string | undefined
  tokenType: string | undefined
  idToken: string | undefined
  expiresInSeconds: number | undefined
  refreshToken: string | undefined
}
