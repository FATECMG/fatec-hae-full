import { DeleteController } from '@common/domain/Controllers'
import { type DeleteUseCase } from '@common/domain/UseCase.interface'

import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeleteCourseController extends DeleteController {
  constructor (
  @inject(CourseLocator.CourseDeleteUseCase) deleteCourseUseCase: DeleteUseCase) {
    super(deleteCourseUseCase)
  }
}
