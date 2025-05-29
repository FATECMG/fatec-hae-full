import { type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Notice } from '@functions/notice/entities'
import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class DeactivateNoticeUseCase implements DeactivateUseCase<Notice> {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeDeactivateRepository) private readonly deactivate: DeactivateEntityRepository<Notice>
  ) {}

  async execute (id: string): Promise<{ deleted: boolean, message: string }> {
    const result = await this.deactivate.perform(id)
    return result ? { deleted: result, message: 'Excluído com sucesso' } : { deleted: result, message: 'Não foi possível excluir, tente novamente mais tarde!' }
  }
}
