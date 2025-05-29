import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { FindAllController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindAllCourseController extends FindAllController<Course, CoursePresentationModel> {
  constructor (
  @inject(CourseLocator.CoursePresentationModelMapper) entityToPresentationModelMapper: Mapper<Course, CoursePresentationModel>,
    @inject(CourseLocator.CourseFindAllUseCase) findAllUseCase: FindAllUseCase<Course>
  ) {
    super(entityToPresentationModelMapper, findAllUseCase)
  }
}
