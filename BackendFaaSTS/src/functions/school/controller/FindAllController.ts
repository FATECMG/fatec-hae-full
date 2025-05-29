import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { FindAllController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class FindAllSchoolController extends FindAllController<School, SchoolPM> {
  constructor (
  @inject(SchoolLocator.SchoolPMMapper) entityToPresentationModelMapper: Mapper<School, SchoolPM>,
    @inject(SchoolLocator.SchoolFindAllUseCase) findAllUseCase: FindAllUseCase<School>
  ) {
    super(entityToPresentationModelMapper, findAllUseCase)
  }
}
