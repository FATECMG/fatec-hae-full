import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { FindOneController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindOneSchoolController extends FindOneController<School, SchoolPM> {
  constructor (
  @inject(SchoolLocator.SchoolFindOneUseCase) findOneUseCase: FindOneUseCase<School>,
    @inject(SchoolLocator.SchoolPMMapper) entityToPresentationModelMapper: Mapper<School, SchoolPM>
  ) {
    super(entityToPresentationModelMapper, findOneUseCase)
  }
}
