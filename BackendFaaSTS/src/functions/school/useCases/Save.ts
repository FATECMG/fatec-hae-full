import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { NotFoundError } from '@common/error/NotFoundError'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class SaveSchoolUseCase implements SaveUseCase<School> {
  constructor (@inject(SchoolLocator.SchoolCreateRepository) private readonly schoolRepository: SaveEntityRepository<School>) {}

  async execute (school: School): Promise<School | Error> {
    try {
      return await this.schoolRepository.perform(school)
    } catch (err) {
      if (err instanceof DuplicatedFieldError || err instanceof NotFoundError) {
        return err
      }
    }
    return new InfraError('Erro inesperado!')
  }
}
