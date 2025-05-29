import { type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateController } from '@common/domain/Controllers'

import { type School } from '@functions/school/entities/School'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeactivateSchoolController extends DeactivateController<School> {
  constructor (@inject(SchoolLocator.SchoolDeactivateUseCase) deactivateUseCase: DeactivateUseCase<School>) {
    super(deactivateUseCase)
  }
}
