import { type DeleteResult, type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeactivateCourseUseCase implements DeactivateUseCase<Course> {
  constructor (@inject(CourseLocator.CourseDeactivateRepository) private readonly courseRepository: DeactivateEntityRepository<Course>) {}

  async execute (id: string): Promise<DeleteResult> {
    const result = await this.courseRepository.perform(id)
    let message = 'Excluído com sucesso'
    if (!result) message = 'Não foi possível excluir, tente novamente mais tarde!'
    return { deleted: result, message }
  }
}
