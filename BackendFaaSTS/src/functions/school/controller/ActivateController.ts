import { type ActivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateController } from '@common/domain/Controllers'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class ActivateSchoolController extends ActivateController<School> {
  constructor (@inject(SchoolLocator.SchoolActivateUseCase) activateUseCase: ActivateUseCase<School>) {
    super(activateUseCase)
  }
}
