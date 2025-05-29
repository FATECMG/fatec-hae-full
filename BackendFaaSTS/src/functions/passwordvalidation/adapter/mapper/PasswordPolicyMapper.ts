import { type Mapper } from '@common/mapper/BaseMapper'
import { type PoliciesPM } from '@functions/passwordvalidation/entities/PasswordPolicyPM'
import { type Policies } from '@functions/passwordvalidation/entities/PassworPolicy'

export class PasswordPolicyMapper implements Mapper<Policies, PoliciesPM> {
  async execute (entity: Policies): Promise<PoliciesPM> {
    return await Promise.resolve({
      regexPolicies: {
        lowerCaseRegex: entity.regexPolicies.lowerCaseRegex,
        upperCaseRegex: entity.regexPolicies.upperCaseRegex,
        numberRegex: entity.regexPolicies.numberRegex,
        symbolsRegex: entity.regexPolicies.symbolsRegex
      },
      lengthPolicies: {
        minLength: entity.lengthPolicies.minLength,
        maxLength: entity.lengthPolicies.maxLength,
        minLowerCase: entity.lengthPolicies.minLowerCase,
        minUpperCase: entity.lengthPolicies.minUpperCase,
        minNumbers: entity.lengthPolicies.minNumbers,
        minSymbols: entity.lengthPolicies.minSymbols
      }
    })
  }
}
