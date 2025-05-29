import { type DeleteResult, type ActivateUseCase } from '@common/domain/UseCase.interface'
import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class ActivateSchoolUseCase implements ActivateUseCase<School> {
  constructor (@inject(SchoolLocator.SchoolActivateRepository) private readonly schoolRepository: ActivateEntityRepository<School>) {}

  async execute (id: string): Promise<DeleteResult> {
    const result = await this.schoolRepository.perform(id)
    let message = 'Restaurado com sucesso'
    if (!result) message = 'Não foi possível restaurar, tente novamente mais tarde!'
    return { deleted: result, message }
  }
}
