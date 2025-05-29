import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindOneSchoolUseCase implements FindOneUseCase<School> {
  constructor (@inject(SchoolLocator.SchoolFindOneRepository) private readonly schoolRepository: FindOneEntityRepository<School>) {}

  async execute (id: string): Promise<School | Error> {
    const result = await this.schoolRepository.perform(id)
    return result === undefined ? new IDNotFoundError(id, 'escola') : result
  }
}
