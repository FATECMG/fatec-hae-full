import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { FindOneController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindOneCourseController extends FindOneController<Course, CoursePresentationModel> {
  constructor (
  @inject(CourseLocator.CourseFindOneUseCase) findOneUseCase: FindOneUseCase<Course>,
    @inject(CourseLocator.CoursePresentationModelMapper) entityToPresentationModelMapper: Mapper<Course, CoursePresentationModel>
  ) {
    super(entityToPresentationModelMapper, findOneUseCase)
  }
}
