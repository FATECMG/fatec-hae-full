import { type UserDataResponse } from '@functions/auth/entities/AuthUserDataResponse'

export interface GetUserByTokenUseCase {
  execute: (accessToken: string) => Promise<UserDataResponse | Error>
}
