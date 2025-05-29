import { PasswordPolicyValidator } from '@functions/passwordvalidation/adapter/validation/PasswordPolicy'
import { ValidationError } from '@common/error/ValidationError'
import { InfraError } from '@common/error/InfraError'

export class PasswordValidatorUseCase {
  constructor () {}

  async execute (password: string): Promise< boolean | Error> {
    try {
      PasswordPolicyValidator
        .validate(password)

      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        return error
      }

      return new InfraError('Erro Inesperado!')
    }
  }
}
