import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'
import { type Notice } from '@functions/notice/entities'

import { inject, injectable } from 'inversify'

@injectable()
export default class FindAllNoticeUseCase implements FindAllUseCase<Notice> {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeFindAllRepository) private readonly findAll: FindAllEntityRepository<Notice>
  ) {}

  async execute (active: boolean): Promise<Notice[]> {
    return await this.findAll.perform(active)
  }
}
