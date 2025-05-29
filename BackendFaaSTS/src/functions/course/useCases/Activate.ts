import { type DeleteResult, type ActivateUseCase } from '@common/domain/UseCase.interface'
import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class ActivateCourseUseCase implements ActivateUseCase<Course> {
  constructor (@inject(CourseLocator.CourseActivateRepository) private readonly courseRepository: ActivateEntityRepository<Course>) {}

  async execute (id: string): Promise<DeleteResult> {
    const result = await this.courseRepository.perform(id)
    let message = 'Restaurado com sucesso'
    if (!result) message = 'Não foi possível restaurar, tente novamente mais tarde!'
    return { deleted: result, message }
  }
}
