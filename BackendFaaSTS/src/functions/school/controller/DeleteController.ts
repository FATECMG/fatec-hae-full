import { type DeleteUseCase } from '@common/domain/UseCase.interface'
import { DeleteController } from '@common/domain/Controllers'

import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeleteSchoolController extends DeleteController {
  constructor (@inject(SchoolLocator.SchoolDeleteUseCase) deleteSchoolUseCase: DeleteUseCase) {
    super(deleteSchoolUseCase)
  }
}
