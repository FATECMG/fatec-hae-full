import { validateDate, DateValidationOption } from '@common/utils/date/validateDate'
import { InvalidRangeDate } from '@common/error/InvalidDate'

describe('validateDate', () => {
  it('should throw an error if the date is before the target date', () => {
    const params = {
      date: '01/01/2020',
      targetDate: '02/01/2020',
      option: DateValidationOption.IS_BEFORE
    }

    expect(() => { validateDate(params) }).toThrow(InvalidRangeDate)
  })

  it('should throw an error if the date is after the target date', () => {
    const params = {
      date: '03/01/2020',
      targetDate: '02/01/2020',
      option: DateValidationOption.IS_AFTER
    }

    expect(() => { validateDate(params) }).toThrow(InvalidRangeDate)
  })

  it('should not throw an error if the date is not before the target date', () => {
    const params = {
      date: '03/01/2020',
      targetDate: '02/01/2020',
      option: DateValidationOption.IS_BEFORE
    }

    expect(() => { validateDate(params) }).not.toThrow()
  })

  it('should not throw an error if the date is not after the target date', () => {
    const params = {
      date: '01/01/2020',
      targetDate: '02/01/2020',
      option: DateValidationOption.IS_AFTER
    }

    expect(() => { validateDate(params) }).not.toThrow()
  })
})
