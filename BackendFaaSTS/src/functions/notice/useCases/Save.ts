import { ValidateNoticeDate, type SaveUseCase } from '@common/domain/UseCase.interface'
import { SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { AlertNotice } from '@common/utils/email/SendNewNoticeEmail.interface'
import { type Notice } from '@functions/notice/entities'

import { DateError } from '@common/error/InvalidDate'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { NotFoundError } from '@common/error/NotFoundError'
import { MailAuthError, MailError } from '@common/error/EmailError'

import { NoticeRepositoryLocator, NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'
import { NoticeEmailUseCaseLocator } from '@functions/email/shared/Di.enums'
import { inject, injectable } from 'inversify'

@injectable()
export default class SaveNoticeUseCase implements SaveUseCase<Notice> {
  constructor (
    @inject(NoticeEmailUseCaseLocator.NoticeEmail)
    private readonly email: AlertNotice,
    @inject(NoticeRepositoryLocator.NoticeSaveRepository)
    private readonly repository: SaveEntityRepository<Notice>,
    @inject(NoticeUseCaseLocator.NoticeValidateDateUseCase)
    private readonly validateDate: ValidateNoticeDate
  ) {}

  async execute (notice: Notice): Promise<Notice | Error> {
    try {
      const isDateValid = await this.validateDate.execute(notice)

      if (isDateValid instanceof Error) { throw isDateValid }

      const response = await this.repository.perform(notice)
      await this.email.execute({
        title: notice.title,
        description: notice.description,
        semester: notice.semester,
        course: 'any_course',
        topicOfInterest: notice.topicsOfInterest,
        openDate: notice.openDate,
        closeDate: notice.closeDate,
        evaluationEndDate: notice.evaluationEndDate
      })
      return response
    } catch (error) {
      if (error instanceof DuplicatedFieldError || error instanceof NotFoundError) { return error }

      if (error instanceof MailError || error instanceof MailAuthError) { return error }

      if (error instanceof DateError) { return error }
      return new InfraError('Erro inesperado!')
    }
  }
}
