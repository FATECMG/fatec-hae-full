import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { NotFoundError } from '@common/error/NotFoundError'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class SaveCourseUseCase implements SaveUseCase<Course> {
  constructor (@inject(CourseLocator.CourseCreateRepository) private readonly courseRepository: SaveEntityRepository<Course>) {}

  async execute (course: Course): Promise<Course | Error> {
    try {
      return await this.courseRepository.perform(course)
    } catch (error) {
      if (error instanceof DuplicatedFieldError || error instanceof NotFoundError) { return error }
    }
    return new InfraError('Erro inesperado!')
  }
}
