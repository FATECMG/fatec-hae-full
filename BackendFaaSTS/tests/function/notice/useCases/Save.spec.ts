import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { errorLabel } from '@functions/notice/adapter/repositories/MongoDB/utils/errorLabel'
import { type MongoServerError } from 'mongodb'
import { SaveNoticeUseCase, type ValidateNoticeDateUseCase } from '@functions/notice/useCases/UseCases'
import { type Notice } from '@functions/notice/entities'

import { MailAuthError } from '@common/error/EmailError'
import { type AlertNotice } from '@common/utils/email/SendNewNoticeEmail.interface'
import { InvalidFormatDate, InvalidRangeDate } from '@common/error/InvalidDate'

describe('SaveNoticeUseCase', () => {
  let templateNotice: Notice
  let systemUnderTest: SaveNoticeUseCase
  let noticeRepository: MockProxy<SaveEntityRepository<Notice>>
  let mockedError: MockProxy<MongoServerError>
  let emailService: MockProxy<AlertNotice>
  let validateDateUseCase: MockProxy<ValidateNoticeDateUseCase>

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
    emailService = mock()
    validateDateUseCase.execute.mockResolvedValue(undefined)
    noticeRepository.perform.mockResolvedValue(templateNotice)
    systemUnderTest = new SaveNoticeUseCase(emailService, noticeRepository, validateDateUseCase)
  })

  it('should calls SaveNoticeMongoRepository with correct params', async () => {
    await systemUnderTest.execute(templateNotice)

    expect(noticeRepository.perform).toHaveBeenCalledTimes(1)
    expect(noticeRepository.perform).toHaveBeenCalledWith(templateNotice)
  })

  it('should return a Notice when repo returns', async () => {
    const result = await systemUnderTest.execute(templateNotice)

    expect(result).toEqual(templateNotice)
  })

  it('should return DuplicatedFieldError when Repo return DuplicatedFieldError', async () => {
    noticeRepository.perform.mockRejectedValueOnce(new DuplicatedFieldError({
      entity: templateNotice,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.execute(templateNotice)

    expect(result).toEqual(new DuplicatedFieldError({
      entity: templateNotice,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))
  })

  it('should return InfraError when Repo throws unexpected error', async () => {
    noticeRepository.perform.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.execute(templateNotice)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })

  it('should rethrow if Email Service throws MailAuthError', async () => {
    emailService.execute.mockRejectedValue(new MailAuthError())

    const promise = await systemUnderTest.execute(templateNotice)

    expect(promise).toEqual(new MailAuthError())
  })

  it('should rethrow if ValidateDateUseCase throws ANY error', async () => {
    validateDateUseCase.execute.mockRejectedValueOnce(new Error('any_error'))

    const promise = systemUnderTest.execute(templateNotice)

    expect(promise).resolves.toThrow(new InfraError('Erro inesperado!'))
  })

  it('should rethrow InvalidFormatDate if ValidateUseCase throw InvalidFormatDate', async () => {
    validateDateUseCase.execute.mockRejectedValueOnce(new InvalidFormatDate('any_field'))

    const promise = systemUnderTest.execute(templateNotice)

    expect(promise).resolves.toThrow(new InvalidFormatDate('any_field'))
  })

  it('should rethrow DateError if ValidateUseCase throw InvalidDateError', async () => {
    validateDateUseCase.execute.mockRejectedValueOnce(new InvalidRangeDate('any_field'))

    const promise = systemUnderTest.execute(templateNotice)

    expect(promise).resolves.toThrow(new InvalidRangeDate('any_field'))
  })
})
