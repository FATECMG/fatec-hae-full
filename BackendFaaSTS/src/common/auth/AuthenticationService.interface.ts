import { type AuthRequest } from '@functions/auth/entities/AuthRequest'
import { type UserDataResponse } from '@functions/auth/entities/AuthUserDataResponse'
import { type AuthTokenResponse } from '@functions/auth/entities/AuthTokenResponse'
import { type UserSignUp } from '@functions/auth/entities/SignUp'
import { type UserDataRequest } from '@functions/auth/entities/AuthUserDataRequest'
import { type UserUpdate } from '@functions/auth/entities/Update'

export interface AuthenticationService {
  signUp: (credentials: UserSignUp) => Promise<boolean | Error >
  signIn: (credentials: AuthRequest) => Promise<AuthTokenResponse | Error >
  updateUserData: (credentials: UserUpdate) => Promise<boolean | Error >
  getUserByToken: (token: UserDataRequest) => Promise<UserDataResponse | Error >
  disableUser: (username: string) => Promise<boolean | Error >
  deleteUser: (username: string) => Promise<boolean | Error >
  enableUser: (username: string) => Promise<boolean | Error >
}
