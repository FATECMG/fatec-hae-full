import { type DeleteResult, type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeactivateSchoolUseCase implements DeactivateUseCase<School> {
  constructor (@inject(SchoolLocator.SchoolDeactivateRepository) private readonly schoolRepository: DeactivateEntityRepository<School>) {}

  async execute (id: string): Promise<DeleteResult> {
    const result = await this.schoolRepository.perform(id)
    let message = 'Excluído com sucesso'
    if (!result) message = 'Não foi possível excluir, tente novamente mais tarde!'
    return { deleted: result, message }
  }
}
