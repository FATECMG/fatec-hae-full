import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindAllCoursesUseCase implements FindAllUseCase<Course> {
  constructor (@inject(CourseLocator.CourseFindAllRepository) private readonly courseRepository: FindAllEntityRepository<Course>) {}

  async execute (active: boolean): Promise<Course[]> {
    return await this.courseRepository.perform(active)
  }
}
