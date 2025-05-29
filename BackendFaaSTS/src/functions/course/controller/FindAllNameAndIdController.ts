import { type Course } from '../entities/Course'
import { type CourseNameAndIdPM } from '../entities/pm/CourseNameAndIdPM'
import { CourseLocator } from '../shared/Di.enums'
import { FindAllUseCase } from '@common/domain/UseCase.interface'

import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllController } from '@common/domain/Controllers'

import { inject, injectable } from 'inversify'

@injectable()
export class FindAllCourseNameAndIdController extends FindAllController<Course, CourseNameAndIdPM> {
  constructor (
  @inject(CourseLocator.CourseNameAndIdPMMapper)
    entityToPresentationModelMapper: Mapper<Course, CourseNameAndIdPM>,
    @inject(CourseLocator.CourseFindAllUseCase)
    findAllUseCase: FindAllUseCase<Course>
  ) {
    super(entityToPresentationModelMapper, findAllUseCase)
  }
}
