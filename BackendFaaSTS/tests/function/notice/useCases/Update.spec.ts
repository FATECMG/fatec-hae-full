import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { errorLabel } from '@functions/notice/adapter/repositories/MongoDB/utils/errorLabel'
import { type MongoServerError } from 'mongodb'
import { UpdateNoticeUseCase, type ValidateNoticeDateUseCase } from '@functions/notice/useCases/UseCases'
import { type Notice } from '@functions/notice/entities'
import { InvalidFormatDate, InvalidRangeDate } from '@common/error/InvalidDate'

describe('UpdateNoticeUseCase', () => {
  let systemUnderTest: UpdateNoticeUseCase
  let noticeRepository: MockProxy<UpdateEntityRepository<Notice>>
  let mockedError: MockProxy<MongoServerError>
  let validateDateUseCase: MockProxy<ValidateNoticeDateUseCase>
  let templateNotice: Notice

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
    templateNotice = {
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      openDate: 'any_openDate',
      closeDate: 'any_closeDate',
      evaluationEndDate: 'any_evaluationEndDate',
      semester: 'any_semester',
      year: 'any_year',
      topicsOfInterest: ['any_topicOfInterest'],
      active: true
    }
    validateDateUseCase = mock()
    noticeRepository = mock()
    validateDateUseCase.execute.mockResolvedValue(undefined)
    noticeRepository.perform.mockResolvedValue(templateNotice)
    systemUnderTest = new UpdateNoticeUseCase(noticeRepository, validateDateUseCase)
  })

  it('should call noticeRepository.perform with correct params', async () => {
    await systemUnderTest.execute('any_id', templateNotice)

    expect(noticeRepository.perform).toHaveBeenCalledTimes(1)
    expect(noticeRepository.perform).toHaveBeenCalledWith(templateNotice, 'any_id')
  })

  it('should return a Notice when repo returns', async () => {
    const result = await systemUnderTest.execute('any_id', templateNotice)

    expect(result).toEqual(templateNotice)
  })

  it('should return NotFoundError when noticeRepository returns undefined', async () => {
    noticeRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id', templateNotice)

    expect(result).toEqual(new IDNotFoundError('any_id', 'edital'))
  })

  it('should return DuplicateFieldError when noticeRepository throws DuplicatedFieldError', async () => {
    noticeRepository.perform.mockRejectedValueOnce(new DuplicatedFieldError({
      entity: templateNotice,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.execute('any_id', templateNotice)

    expect(result).toEqual(new DuplicatedFieldError({
      entity: templateNotice,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))
  })

  it('should return InfraError when noticeRepository throws any other error', async () => {
    noticeRepository.perform.mockRejectedValueOnce(new Error('any_error'))

    const result = await systemUnderTest.execute('any_id', templateNotice)

    expect(result).toStrictEqual(new InfraError('Erro inesperado!'))
  })

  it('should rethrow if ValidateDateUseCase throws ANY error', async () => {
    validateDateUseCase.execute.mockRejectedValueOnce(new Error('any_error'))

    const promise = systemUnderTest.execute('any_id', templateNotice)

    expect(promise).resolves.toThrow(new InfraError('Erro inesperado!'))
  })

  it('should rethrow InvalidFormatDate if ValidateUseCase throw InvalidFormatDate', async () => {
    validateDateUseCase.execute.mockRejectedValueOnce(new InvalidFormatDate('any_field'))

    const promise = systemUnderTest.execute('any_id', templateNotice)

    expect(promise).resolves.toThrow(new InvalidFormatDate('any_field'))
  })

  it('should rethrow DateError if ValidateUseCase throw InvalidDateError', async () => {
    validateDateUseCase.execute.mockRejectedValueOnce(new InvalidRangeDate('any_field'))

    const promise = systemUnderTest.execute('any_id', templateNotice)

    expect(promise).resolves.toThrow(new InvalidRangeDate('any_field'))
  })
})
