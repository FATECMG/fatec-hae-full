import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class UpdateSchoolUseCase implements UpdateUseCase<School> {
  constructor (@inject(SchoolLocator.SchoolUpdateRepository) private readonly schoolRepository: UpdateEntityRepository<School>) {}

  async execute (id: string, school: School): Promise<School | Error> {
    try {
      return await this.schoolRepository.perform(school, id) ?? new IDNotFoundError(id, 'escola')
    } catch (err) {
      if (err instanceof DuplicatedFieldError || err instanceof NotFoundError) {
        return err
      }
    }
    return new InfraError('Erro inesperado!')
  }
}
