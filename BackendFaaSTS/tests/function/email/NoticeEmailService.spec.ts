import 'reflect-metadata'
import { type MockProxy, mock } from 'jest-mock-extended'
import { InfraError } from '@common/error/InfraError'
import { type NoticeEmailProps } from '@functions/notice/entities/NoticeEmail'
import { type AlertNotice } from '@common/utils/email/SendNewNoticeEmail.interface'
import { NoticeEmail } from '@functions/email/useCase/NoticeEmail'
import { type SendEmailService } from '@common/utils/email/SendEmail.interface'

describe.only('NoticeEmail UseCase', () => {
  let sutAlertNotice: MockProxy<AlertNotice>
  let sutNoticeEmail: NoticeEmail
  let noticeEmailProps: NoticeEmailProps
  let emailService: MockProxy<SendEmailService>

  beforeAll(() => {
    emailService = mock()
    sutAlertNotice = mock()
    sutNoticeEmail = new NoticeEmail(emailService)
    noticeEmailProps = {
      title: 'any_title',
      course: 'any_course',
      description: 'any_description',
      semester: 'any_semester',
      openDate: 'any_open_date',
      closeDate: 'any_close_date',
      evaluationEndDate: 'any_evaluation_end_date',
      topicOfInterest: ['any_topic']
    }
  })

  it('it should call execute with correct params', async () => {
    await sutAlertNotice.execute(noticeEmailProps)
    expect(sutAlertNotice.execute).toHaveBeenCalledWith({
      title: 'any_title',
      course: 'any_course',
      description: 'any_description',
      semester: 'any_semester',
      openDate: 'any_open_date',
      closeDate: 'any_close_date',
      evaluationEndDate: 'any_evaluation_end_date',
      topicOfInterest: ['any_topic']
    })
  })

  it('it should return undefined it is successfull executed', async () => {
    sutAlertNotice.execute.mockResolvedValueOnce(undefined)
    const promise = sutAlertNotice.execute(noticeEmailProps)
    expect(promise).resolves.toBeUndefined()
  })

  it('it should rethrow if SendEmailService throws InfraError if any error is thrown', async () => {
    emailService.execute.mockImplementation(() => { throw new Error('any_error') })
    const promise = sutNoticeEmail.execute(noticeEmailProps)
    expect(promise).rejects.toThrow(new InfraError('Erro Inesperado'))
  })
})
