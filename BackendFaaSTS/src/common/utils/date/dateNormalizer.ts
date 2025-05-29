export const DateNormalizer = {
  fromBrazillianPattern: (date: string): Date => {
    const [day, month, year] = date.split('/').map(Number)
    if (month < 1 || month > 12) {
      throw new Error('Data Inválida!')
    }
    return new Date(year, month - 1, day)
  }
}
