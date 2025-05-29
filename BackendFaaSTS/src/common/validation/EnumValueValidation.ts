const locale = 'pt-br'
const options = 'base'

export const findMatchingEnumValue = <E extends Record<string, string>>(value: string, enumObject: E): string | undefined => {
  const enumKey = Object.keys(enumObject).find(key =>
    enumObject[key].localeCompare(value, locale, { sensitivity: options }) === 0
  )
  return enumKey ? enumObject[enumKey] : undefined
}
