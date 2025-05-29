import { type ActivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateController } from '@common/domain/Controllers'

import { type Course } from '@functions/course/entities/Course'
import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class ActivateCourseController extends ActivateController<Course> {
  constructor (@inject(CourseLocator.CourseActivateUseCase) activateUseCase: ActivateUseCase<Course>) {
    super(activateUseCase)
  }
}
