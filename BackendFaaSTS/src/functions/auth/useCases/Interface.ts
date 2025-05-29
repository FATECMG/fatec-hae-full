import { type AuthTokenResponse } from '@functions/auth/entities/AuthTokenResponse'

export interface AuthenticateUseCase {
  execute: (email: string, password: string) => Promise<AuthTokenResponse | Error>
}
