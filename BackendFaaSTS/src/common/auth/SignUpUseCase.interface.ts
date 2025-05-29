import { type UserSignUp } from '@functions/auth/entities/SignUp'

export interface AuthSignUpUseCase {
  execute: (credentials: UserSignUp) => Promise<boolean | Error >
}
