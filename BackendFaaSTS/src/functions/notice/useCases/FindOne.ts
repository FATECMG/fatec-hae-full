import { FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { IDNotFoundError } from '@common/error/NotFoundError'

import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'
import { type Notice } from '@functions/notice/entities'

import { inject, injectable } from 'inversify'

@injectable()
export default class FindOneNoticeUseCase implements FindOneUseCase<Notice> {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeFindOneRepository) private readonly findOne: FindOneEntityRepository<Notice>
  ) { }

  async execute (id: string): Promise<Notice | Error> {
    const result = await this.findOne.perform(id)
    return result === undefined ? new IDNotFoundError(id, 'edital') : result
  }
}
