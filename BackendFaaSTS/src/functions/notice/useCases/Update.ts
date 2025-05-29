import { ValidateNoticeDate, type UpdateUseCase } from '@common/domain/UseCase.interface'
import { UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { type Notice } from '@functions/notice/entities'

import { DateError } from '@common/error/InvalidDate'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'

import { NoticeRepositoryLocator, NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'
import { inject, injectable } from 'inversify'

@injectable()
export default class UpdateNoticeUseCase implements UpdateUseCase<Notice> {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeUpdateRepository)
    private readonly repository: UpdateEntityRepository<Notice>,
    @inject(NoticeUseCaseLocator.NoticeValidateDateUseCase)
    private readonly validateDate: ValidateNoticeDate
  ) {}

  async execute (id: string, entity: Notice): Promise<Notice | Error> {
    try {
      const isDateValid = await this.validateDate.execute(entity)
      if (isDateValid instanceof Error) { throw isDateValid }
      return await this.repository.perform(entity, id) ?? new IDNotFoundError(id, 'edital')
    } catch (error) {
      if (error instanceof DuplicatedFieldError || error instanceof NotFoundError) { return error }
      if (error instanceof DateError) { return error }
      return new InfraError('Erro inesperado!')
    }
  }
}
