import 'reflect-metadata'

import { InvalidFormatDate, InvalidRangeDate } from '@common/error/InvalidDate'
import { ValidateNoticeDateUseCase } from '@functions/notice/useCases/UseCases'

jest.useFakeTimers().setSystemTime(new Date(2021, 0, 1))

describe('Validate Notice Date UseCase', () => {
  let systemUnderTest: ValidateNoticeDateUseCase
  let dates: any

  beforeAll(() => {
    dates = {
      openDate: '02/01/2021',
      closeDate: '20/01/2021',
      evaluationEndDate: '25/01/2021'
    }

    systemUnderTest = new ValidateNoticeDateUseCase()
  })

  it('should return undefined when the dates are valid', async () => {
    const result = await systemUnderTest.execute({ ...dates })

    expect(result).toBeUndefined()
  })

  it('should throw InvalidFormatDate when OpenDate is invalid', async () => {
    const result = systemUnderTest.execute({ ...dates, openDate: 'any_invalid_date' })
    expect(result).rejects.toThrow(new InvalidFormatDate('openDate'))
  })

  it('should throw InvalidFormatDate when CloseDate is invalid', async () => {
    const result = systemUnderTest.execute({ ...dates, closeDate: 'any_invalid_date' })
    expect(result).rejects.toThrow(new InvalidFormatDate('closeDate'))
  })

  it('should throw InvalidFormatDate when EvaluationEndDate is invalid', async () => {
    const result = systemUnderTest.execute({ ...dates, evaluationEndDate: 'any_invalid_date' })
    expect(result).rejects.toThrow(new InvalidFormatDate('evaluationEndDate'))
  })

  it('should throw InvalidRangeDate when OpenDate is greater than CloseDate', async () => {
    const result = systemUnderTest.execute({ ...dates, openDate: '21/01/2021' })
    expect(result).rejects.toThrow(new InvalidRangeDate('openDate', 'Data de fim deve ser posterior a data de início'))
  })

  it('should throw InvalidRangeDate when OpenDate is greater than EvaluationEndDate', async () => {
    const result = systemUnderTest.execute({ ...dates, openDate: '26/01/2021' })
    expect(result).rejects.toThrow(new InvalidRangeDate('openDate', 'Data de fim deve ser posterior a data de início'))
  })

  it('should throw InvalidRangeDate when CloseDate is greater than EvaluationEndDate', async () => {
    const result = systemUnderTest.execute({ ...dates, closeDate: '26/01/2021' })
    expect(result).rejects.toThrow(new InvalidRangeDate('closeDate', 'Data limite de avaliação deve ser posterior a data de fim de recebimento'))
  })

  it('should throw InvalidRangeDate when OpenDate is equal to EvaluationEndDate', async () => {
    const result = systemUnderTest.execute({ ...dates, openDate: '25/01/2021' })
    expect(result).rejects.toThrow(new InvalidRangeDate('openDate', 'Data de fim deve ser posterior a data de início'))
  })

  it('should throw InvalidRangeDate when EvaluationEndDate is equal to CloseDate', async () => {
    const result = systemUnderTest.execute({ ...dates, closeDate: '25/01/2021' })
    expect(result).rejects.toThrow(new InvalidRangeDate('closeDate', 'Data limite de avaliação deve ser posterior a data de fim de recebimento'))
  })
})
