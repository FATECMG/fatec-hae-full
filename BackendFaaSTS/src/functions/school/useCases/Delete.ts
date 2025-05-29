import { type DeleteUseCase, type DeleteResult } from '@common/domain/UseCase.interface'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeleteSchoolUseCase implements DeleteUseCase {
  constructor (@inject(SchoolLocator.SchoolDeleteRepository) private readonly schoolRepository: DeleteEntityRepository) {}

  async execute (id: string): Promise<DeleteResult> {
    const result = await this.schoolRepository.perform(id)
    let message = 'Excluído com sucesso'
    if (!result) message = 'Não foi possível excluir, tente novamente mais tarde!'
    return { deleted: result, message }
  }
}
