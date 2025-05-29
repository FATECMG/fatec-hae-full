import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { SaveController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'

import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class SaveCourseController extends SaveController<CourseDTO, Course, CoursePresentationModel> {
  constructor (
  @inject(CourseLocator.CourseDTOSchemaValidation) dtoValidator: NewValidationSchema,
    @inject(CourseLocator.CourseDTOMapper) dtoToEntityMapper: Mapper<CourseDTO, Course>,
    @inject(CourseLocator.CoursePresentationModelMapper) entityToPresentationModelMapper: Mapper<Course, CoursePresentationModel>,
    @inject(CourseLocator.CourseCreateUseCase) entityUseCase: SaveUseCase<Course>
  ) {
    super(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, entityUseCase)
  }
}
