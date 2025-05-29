import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class UpdateCourseUseCase implements UpdateUseCase<Course> {
  constructor (@inject(CourseLocator.CourseUpdateRepository) private readonly courseRepository: UpdateEntityRepository<Course>) {}

  async execute (id: string, course: Course): Promise<Course | Error> {
    try {
      return await this.courseRepository.perform(course, id) ?? new IDNotFoundError(id, 'curso')
    } catch (error) {
      if (error instanceof DuplicatedFieldError || error instanceof NotFoundError) { return error }
    }
    return new InfraError('Erro inesperado!')
  }
}
