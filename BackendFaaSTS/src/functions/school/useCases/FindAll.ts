import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindAllSchoolsUseCase implements FindAllUseCase<School> {
  constructor (@inject(SchoolLocator.SchoolFindAllRepository) private readonly schoolRepository: FindAllEntityRepository<School>) {}

  async execute (active: boolean): Promise<School[]> {
    return await this.schoolRepository.perform(active)
  }
}
