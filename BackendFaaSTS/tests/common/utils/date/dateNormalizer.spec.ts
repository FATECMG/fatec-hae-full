import { DateNormalizer } from '@common/utils/date/dateNormalizer'

describe('DateNormalizer', () => {
  describe('fromBrazillianPattern', () => {
    it('should correctly convert a date from the Brazilian pattern to a Date object', () => {
      const date = '31/12/2020'
      const expectedDate = new Date(2020, 11, 31)

      const result = DateNormalizer.fromBrazillianPattern(date)

      expect(result).toEqual(expectedDate)
    })

    it('should throw an error for an invalid date', () => {
      const date = '31/13/2020'

      expect(() => DateNormalizer.fromBrazillianPattern(date)).toThrow()
    })
  })
})
