import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { IDNotFoundError } from '@common/error/NotFoundError'

import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'
import { type NoticeTopicsOfInterest } from '@functions/notice/entities'

import { inject, injectable } from 'inversify'

@injectable()
export default class FindTopicsByNoticeIdUseCase implements FindOneUseCase<NoticeTopicsOfInterest> {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeFindTopicsByNoticeIdRepository)
    private readonly findAll: FindOneEntityRepository<NoticeTopicsOfInterest>
  ) {}

  async execute (id: string): Promise<NoticeTopicsOfInterest | Error> {
    const result = await this.findAll.perform(id)
    return result === undefined ? new IDNotFoundError(id, 'edital') : result
  }
}
