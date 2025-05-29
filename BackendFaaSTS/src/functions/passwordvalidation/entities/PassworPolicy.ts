interface LengthPolicies {
  minLength: number
  maxLength: number
  minLowerCase: number
  minUpperCase: number
  minNumbers: number
  minSymbols: number
}

interface RegexPolicies {
  lowerCaseRegex: string
  upperCaseRegex: string
  numberRegex: string
  symbolsRegex: string
}

export interface Policies {
  lengthPolicies: LengthPolicies
  regexPolicies: RegexPolicies
}
