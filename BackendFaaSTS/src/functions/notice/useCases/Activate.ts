import { type ActivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Notice } from '@functions/notice/entities'
import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class ActivateNoticeUseCase implements ActivateUseCase<Notice> {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeActivateRepository) private readonly activate: ActivateEntityRepository<Notice>
  ) {}

  async execute (id: string): Promise<{ deleted: boolean, message: string }> {
    const result = await this.activate.perform(id)
    return result ? { deleted: result, message: 'Restaurado com sucesso' } : { deleted: result, message: 'Não foi possível restaurar, tente novamente mais tarde!' }
  }
}
