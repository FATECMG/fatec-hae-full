export const FOUNDERS_NAME = ['Andrew Ribeiro', 'Pedro Lerro', 'Ricardo Pariz']

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
