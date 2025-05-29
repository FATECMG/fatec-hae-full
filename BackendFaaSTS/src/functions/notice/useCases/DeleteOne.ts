import { type DeleteResult, type DeleteUseCase } from '@common/domain/UseCase.interface'
import { DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { NoticeRepositoryLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class DeleteNoticeUseCase implements DeleteUseCase {
  constructor (
    @inject(NoticeRepositoryLocator.NoticeDeleteRepository) private readonly deleteOne: DeleteEntityRepository
  ) {}

  async execute (id: string): Promise<DeleteResult> {
    const result = await this.deleteOne.perform(id)
    return result ? { deleted: result, message: 'Excluído com sucesso' } : { deleted: result, message: 'Não foi possível excluir, tente novamente mais tarde!' }
  }
}
