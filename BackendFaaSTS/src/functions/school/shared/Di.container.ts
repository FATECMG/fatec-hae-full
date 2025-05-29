import 'reflect-metadata'
import { Container } from 'inversify'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import {
  type FindOneUseCase,
  type FindAllUseCase,
  type SaveUseCase,
  type UpdateUseCase,
  type DeleteUseCase,
  type ActivateUseCase,
  type DeactivateUseCase
} from '@common/domain/UseCase.interface'
import {
  type ActivateController,
  type DeactivateController,
  type SaveController,
  type DeleteController,
  type FindAllController,
  type UpdateController,
  type FindOneController
} from '@common/domain/Controllers'
import {
  type FindOneEntityRepository,
  type FindAllEntityRepository,
  type SaveEntityRepository,
  type UpdateEntityRepository,
  type DeleteEntityRepository,
  type ActivateEntityRepository,
  type DeactivateEntityRepository
} from '@common/repository/RepositoryInterface'

import { SchoolToSchoolPM, SchoolDtoToSchoolWithUppercasing } from '@functions/school/adapter/mapper'
import { type SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { SchoolDTOZodValidation } from '@functions/school/adapter/validation/ZodValidation'
import { type School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { SchoolLocator } from '@functions/school/shared/Di.enums'
import { ActivateSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Activate'
import { DeactivateSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Deactivate'
import { DeleteSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Delete'
import { FindAllSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/FindAll'
import { FindOneSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/FindOne'
import { SaveSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Save'
import { UpdateSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Update'
import { ActivateSchoolController } from '@functions/school/controller/ActivateController'
import { DeactivateSchoolController } from '@functions/school/controller/DeactivateController'
import { DeleteSchoolController } from '@functions/school/controller/DeleteController'
import { FindAllSchoolController } from '@functions/school/controller/FindAllController'
import { FindOneSchoolController } from '@functions/school/controller/FindOneController'
import { SaveSchoolController } from '@functions/school/controller/SaveController'
import { UpdateSchoolController } from '@functions/school/controller/UpdateController'
import { ActivateSchoolUseCase } from '@functions/school/useCases/Activate'
import { DeactivateSchoolUseCase } from '@functions/school/useCases/Deactivate'
import { DeleteSchoolUseCase } from '@functions/school/useCases/Delete'
import { FindOneSchoolUseCase } from '@functions/school/useCases/FindOne'
import { SaveSchoolUseCase } from '@functions/school/useCases/Save'
import { FindAllSchoolsUseCase } from '@functions/school/useCases/FindAll'
import { UpdateSchoolUseCase } from '@functions/school/useCases/Update'

export const schoolContainer = new Container()

schoolContainer.bind<Mapper<School, SchoolPM>>(SchoolLocator.SchoolPMMapper)
  .to(SchoolToSchoolPM)

schoolContainer.bind<Mapper<SchoolDTO, School>>(SchoolLocator.SchoolDTOMapper)
  .to(SchoolDtoToSchoolWithUppercasing)

schoolContainer.bind<NewValidationSchema>(SchoolLocator.SchoolDTOValidationSchema)
  .to(SchoolDTOZodValidation)

schoolContainer.bind<FindOneController<School, SchoolPM>>(SchoolLocator.SchoolFindOneController)
  .to(FindOneSchoolController)

schoolContainer.bind<FindAllController<School, SchoolPM>>(SchoolLocator.SchoolFindAllController)
  .to(FindAllSchoolController)

schoolContainer.bind<SaveController<SchoolDTO, School, SchoolPM>>(SchoolLocator.SchoolCreateController)
  .to(SaveSchoolController)

schoolContainer.bind<UpdateController<SchoolDTO, School, SchoolPM>>(SchoolLocator.SchoolUpdateController)
  .to(UpdateSchoolController)

schoolContainer.bind<DeleteController>(SchoolLocator.SchoolDeleteController)
  .to(DeleteSchoolController)

schoolContainer.bind<ActivateController<School>>(SchoolLocator.SchoolActivateController)
  .to(ActivateSchoolController)

schoolContainer.bind<DeactivateController<School>>(SchoolLocator.SchoolDeactivateController)
  .to(DeactivateSchoolController)

schoolContainer.bind<FindOneEntityRepository<School>>(SchoolLocator.SchoolFindOneRepository)
  .to(FindOneSchoolMongoRepository)

schoolContainer.bind<FindAllEntityRepository<School>>(SchoolLocator.SchoolFindAllRepository)
  .to(FindAllSchoolMongoRepository)

schoolContainer.bind<SaveEntityRepository<School>>(SchoolLocator.SchoolCreateRepository)
  .to(SaveSchoolMongoRepository)

schoolContainer.bind<UpdateEntityRepository<School>>(SchoolLocator.SchoolUpdateRepository)
  .to(UpdateSchoolMongoRepository)

schoolContainer.bind<DeleteEntityRepository>(SchoolLocator.SchoolDeleteRepository)
  .to(DeleteSchoolMongoRepository)

schoolContainer.bind<ActivateEntityRepository<School>>(SchoolLocator.SchoolActivateRepository)
  .to(ActivateSchoolMongoRepository)

schoolContainer.bind<DeactivateEntityRepository<School>>(SchoolLocator.SchoolDeactivateRepository)
  .to(DeactivateSchoolMongoRepository)

schoolContainer.bind<FindOneUseCase<School>>(SchoolLocator.SchoolFindOneUseCase)
  .to(FindOneSchoolUseCase)

schoolContainer.bind<FindAllUseCase<School>>(SchoolLocator.SchoolFindAllUseCase)
  .to(FindAllSchoolsUseCase)

schoolContainer.bind<SaveUseCase<School>>(SchoolLocator.SchoolCreateUseCase)
  .to(SaveSchoolUseCase)

schoolContainer.bind<UpdateUseCase<School>>(SchoolLocator.SchoolUpdateUseCase)
  .to(UpdateSchoolUseCase)

schoolContainer.bind<DeleteUseCase>(SchoolLocator.SchoolDeleteUseCase)
  .to(DeleteSchoolUseCase)

schoolContainer.bind<ActivateUseCase<School>>(SchoolLocator.SchoolActivateUseCase)
  .to(ActivateSchoolUseCase)

schoolContainer.bind<DeactivateUseCase<School>>(SchoolLocator.SchoolDeactivateUseCase)
  .to(DeactivateSchoolUseCase)
