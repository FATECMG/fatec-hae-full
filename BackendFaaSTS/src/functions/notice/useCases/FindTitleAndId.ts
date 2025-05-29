import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'
import { type NoticeTitleAndId } from '@functions/notice/entities/'

import { inject, injectable } from 'inversify'

@injectable()
export default class FindAllNoticeNameAndIdUseCase implements FindAllUseCase<NoticeTitleAndId> {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeFindTitleAndIdRepository) private readonly findAll: FindAllEntityRepository<NoticeTitleAndId>
  ) {}

  async execute (active: boolean): Promise<NoticeTitleAndId[]> {
    return await this.findAll.perform(active)
  }
}
