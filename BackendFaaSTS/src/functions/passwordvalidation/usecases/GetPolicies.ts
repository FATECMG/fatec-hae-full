import { PasswordPolicyValidator } from '@functions/passwordvalidation/adapter/validation/PasswordPolicy'
import { type Policies } from '@functions/passwordvalidation/entities/PassworPolicy'

export class GetPoliciesUseCase {
  constructor () {}
  async execute (): Promise<Policies> {
    return PasswordPolicyValidator.getValidationPolicy()
  }
}
