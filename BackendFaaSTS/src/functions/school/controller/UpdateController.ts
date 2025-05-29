import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { UpdateController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'

import { type School } from '@functions/school/entities/School'
import { type SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class UpdateSchoolController extends UpdateController<SchoolDTO, School, SchoolPM> {
  constructor (
  @inject(SchoolLocator.SchoolDTOValidationSchema) dtoValidator: NewValidationSchema,
    @inject(SchoolLocator.SchoolDTOMapper) dtoToEntityMapper: Mapper<SchoolDTO, School>,
    @inject(SchoolLocator.SchoolPMMapper) entityToPresentationModelMapper: Mapper<School, SchoolPM>,
    @inject(SchoolLocator.SchoolUpdateUseCase) entityUseCase: UpdateUseCase<School>
  ) {
    super(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, entityUseCase)
  }
}
