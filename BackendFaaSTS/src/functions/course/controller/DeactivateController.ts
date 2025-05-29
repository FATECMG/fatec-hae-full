import { type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateController } from '@common/domain/Controllers'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeactivateCourseController extends DeactivateController<Course> {
  constructor (
  @inject(CourseLocator.CourseDeactivateUseCase) deactivateUseCase: DeactivateUseCase<Course>
  ) {
    super(deactivateUseCase)
  }
}
