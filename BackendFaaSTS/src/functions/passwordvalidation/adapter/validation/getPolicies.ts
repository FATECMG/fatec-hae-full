import { type Policies } from '@functions/passwordvalidation/entities/PassworPolicy'

export const getPolicies = (): Policies => {
  return {
    lengthPolicies: {
      minLength: 8,
      maxLength: 64,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    regexPolicies: {
      lowerCaseRegex: '([a-z])',
      upperCaseRegex: '([A-Z])',
      numberRegex: '([0-9])',
      symbolsRegex: '([^a-zA-Z0-9])'
    }
  } as const
}
