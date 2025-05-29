import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindOneCourseUseCase implements FindOneUseCase<Course> {
  constructor (
    @inject(CourseLocator.CourseFindOneRepository) private readonly findOneCourseRepository: FindOneEntityRepository<Course>
  ) {}

  async execute (id: string): Promise<Course | Error> {
    const result = await this.findOneCourseRepository.perform(id)
    return result === undefined ? new IDNotFoundError(id, 'curso') : result
  }
}
