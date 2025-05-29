interface LengthPoliciesPM {
  minLength: number
  maxLength: number
  minLowerCase: number
  minUpperCase: number
  minNumbers: number
  minSymbols: number
}

interface RegexPoliciesPM {
  lowerCaseRegex: string
  upperCaseRegex: string
  numberRegex: string
  symbolsRegex: string
}

export interface PoliciesPM {
  lengthPolicies: LengthPoliciesPM
  regexPolicies: RegexPoliciesPM
}
