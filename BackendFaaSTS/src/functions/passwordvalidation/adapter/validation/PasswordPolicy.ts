import { ValidationError } from '@common/error/ValidationError'
import { getPolicies } from './getPolicies'
import { type Policies } from '@functions/passwordvalidation/entities/PassworPolicy'

const { lengthPolicies, regexPolicies } = getPolicies()

export class PasswordPolicyValidator {
  private readonly minLength: number = lengthPolicies.minLength
  private readonly maxLength: number = lengthPolicies.maxLength
  private readonly minLowerCase: number = lengthPolicies.minLowerCase
  private readonly minUpperCase: number = lengthPolicies.minUpperCase
  private readonly minNumbers: number = lengthPolicies.minNumbers
  private readonly minSymbols: number = lengthPolicies.minSymbols

  private readonly minLowerCaseRegex: string = regexPolicies.lowerCaseRegex
  private readonly minUpperCaseRegex: string = regexPolicies.upperCaseRegex
  private readonly minNumberRegex: string = regexPolicies.numberRegex
  private readonly minSymbolsRegex: string = regexPolicies.symbolsRegex

  private readonly password: string

  private constructor (passwordProp: string | null) {
    if (passwordProp == null) {
      throw new ValidationError([{ field: 'password', message: 'A senha é obrigatória' }])
    }
    this.password = passwordProp
  }

  private hasAtLeastMinLength (): PasswordPolicyValidator {
    if (this.password !== undefined && this.password.length >= this.minLength) return this
    throw new ValidationError([{ field: 'password', message: `A senha deve conter no minímo ${this.minLength} caracteres` }])
  }

  private hasAtMostMaxLength (): PasswordPolicyValidator {
    if (this.password.length <= this.maxLength) return this
    throw new ValidationError([{ field: 'password', message: `A senha deve conter no maxímo ${this.maxLength} caracteres(s)` }])
  }

  private hasAtLeastMinLowerCase (): PasswordPolicyValidator {
    if ((this.password.match(new RegExp(this.minLowerCaseRegex)) != null)) return this
    throw new ValidationError([{ field: 'password', message: `A senha deve conter no minímo ${this.minLowerCase} carectere(s) minúsculo` }])
  }

  private hasAtLeastMinUpperCase (): PasswordPolicyValidator {
    if ((this.password.match(new RegExp(this.minUpperCaseRegex)) != null)) return this
    throw new ValidationError([{ field: 'password', message: `A senha deve conter no minímo ${this.minUpperCase} carectere(s) maiúsculo` }])
  }

  private hasAtLeastMinNumbers (): PasswordPolicyValidator {
    if ((this.password.match(new RegExp(this.minNumberRegex)) != null)) return this
    throw new ValidationError([{ field: 'password', message: `A senha deve conter no minímo ${this.minNumbers} carectere(s) numérico` }])
  }

  private hasAtLeastMinSymbols (): PasswordPolicyValidator {
    if ((this.password.match(new RegExp(this.minSymbolsRegex)) != null)) return this
    throw new ValidationError([{ field: 'password', message: `A senha deve conter no minímo ${this.minSymbols} carectere(s) especial` }])
  }

  public static getValidationPolicy (): Policies {
    return getPolicies()
  }

  public static validate (password: string): void | ValidationError {
    new PasswordPolicyValidator(password)
      .hasAtLeastMinLength()
      .hasAtMostMaxLength()
      .hasAtLeastMinLowerCase()
      .hasAtLeastMinUpperCase()
      .hasAtLeastMinNumbers()
      .hasAtLeastMinSymbols()
  }
}
