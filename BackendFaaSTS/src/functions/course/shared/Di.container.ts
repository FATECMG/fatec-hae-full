import 'reflect-metadata'
import { Container } from 'inversify'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import {
  type FindOneController,
  type FindAllController,
  type SaveController,
  type UpdateController,
  type DeleteController,
  type ActivateController,
  type DeactivateController
} from '@common/domain/Controllers'
import {
  type SaveEntityRepository,
  type FindAllEntityRepository,
  type FindOneEntityRepository,
  type UpdateEntityRepository,
  type DeleteEntityRepository,
  type ActivateEntityRepository,
  type DeactivateEntityRepository
} from '@common/repository/RepositoryInterface'
import {
  type SaveUseCase,
  type FindAllUseCase,
  type FindOneUseCase,
  type UpdateUseCase,
  type DeleteUseCase,
  type ActivateUseCase,
  type DeactivateUseCase
} from '@common/domain/UseCase.interface'

import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { type Course } from '@functions/course/entities/Course'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { CourseLocator } from '@functions/course/shared/Di.enums'
import {
  CourseDTOMapper,
  CourseMapperPresentationModel,
  CourseNameAndIdMapperPM
} from '@functions/course/adapter/mapper/Course.mapper'
import { CourseZodValidation } from '@functions/course/adapter/validation/CourseZodValidation'
import { FindOneCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/FindOne'
import { FindOneCourseUseCase } from '@functions/course/useCases/FindOne'
import { FindOneCourseController } from '@functions/course/controller/FindOneController'
import { FindAllCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/FindAll'
import { FindAllCoursesUseCase } from '@functions/course/useCases/FindAll'
import { FindAllCourseController } from '@functions/course/controller/FindAllController'
import { SaveCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Save'
import { SaveCourseUseCase } from '@functions/course/useCases/Save'
import { SaveCourseController } from '@functions/course/controller/SaveController'
import { UpdateCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Update'
import { UpdateCourseUseCase } from '@functions/course/useCases/Update'
import { UpdateCourseController } from '@functions/course/controller/UpdateController'
import { DeleteCourseUseCase } from '@functions/course/useCases/Delete'
import { DeleteCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Delete'
import { DeleteCourseController } from '@functions/course/controller/DeleteController'
import { ActivateCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Activate'
import { ActivateCourseUseCase } from '@functions/course/useCases/Activate'
import { ActivateCourseController } from '@functions/course/controller/ActivateController'
import { DeactivateCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Deactivate'
import { DeactivateCourseUseCase } from '@functions/course/useCases/Deactivate'
import { DeactivateCourseController } from '@functions/course/controller/DeactivateController'
import { type CourseNameAndIdPM } from '../entities/pm/CourseNameAndIdPM'
import { FindAllCourseNameAndIdController } from '../controller/FindAllNameAndIdController'

export const courseContainer = new Container()

courseContainer
  .bind<Mapper<CourseDTO, Course>>(CourseLocator.CourseDTOMapper)
  .to(CourseDTOMapper)

courseContainer
  .bind<Mapper<Course, CoursePresentationModel>>(CourseLocator.CoursePresentationModelMapper)
  .to(CourseMapperPresentationModel)

courseContainer
  .bind<Mapper<Course, CourseNameAndIdPM>>(CourseLocator.CourseNameAndIdPMMapper)
  .to(CourseNameAndIdMapperPM)

courseContainer
  .bind<NewValidationSchema>(CourseLocator.CourseDTOSchemaValidation)
  .to(CourseZodValidation)

courseContainer
  .bind<FindOneEntityRepository<Course>>(CourseLocator.CourseFindOneRepository)
  .to(FindOneCourseMongoRepository)

courseContainer
  .bind<FindOneUseCase<Course>>(CourseLocator.CourseFindOneUseCase)
  .to(FindOneCourseUseCase)

courseContainer
  .bind<FindOneController<Course, CoursePresentationModel>>(CourseLocator.CourseFindOneController)
  .to(FindOneCourseController)

courseContainer
  .bind<FindAllEntityRepository<Course>>(CourseLocator.CourseFindAllRepository)
  .to(FindAllCourseMongoRepository)

courseContainer
  .bind<FindAllUseCase<Course>>(CourseLocator.CourseFindAllUseCase)
  .to(FindAllCoursesUseCase)

courseContainer
  .bind<FindAllController<Course, CoursePresentationModel>>(CourseLocator.CourseFindAllController)
  .to(FindAllCourseController)

courseContainer
  .bind<SaveEntityRepository<Course>>(CourseLocator.CourseCreateRepository)
  .to(SaveCourseMongoRepository)

courseContainer
  .bind<SaveUseCase<Course>>(CourseLocator.CourseCreateUseCase)
  .to(SaveCourseUseCase)

courseContainer
  .bind<SaveController<CourseDTO, Course, CoursePresentationModel>>(CourseLocator.CourseCreateController)
  .to(SaveCourseController)

courseContainer
  .bind<UpdateEntityRepository<Course>>(CourseLocator.CourseUpdateRepository)
  .to(UpdateCourseMongoRepository)

courseContainer
  .bind<UpdateUseCase<Course>>(CourseLocator.CourseUpdateUseCase)
  .to(UpdateCourseUseCase)

courseContainer
  .bind<UpdateController<CourseDTO, Course, CoursePresentationModel>>(CourseLocator.CourseUpdateController)
  .to(UpdateCourseController)

courseContainer
  .bind<DeleteEntityRepository>(CourseLocator.CourseDeleteRepository)
  .to(DeleteCourseMongoRepository)

courseContainer
  .bind<DeleteUseCase>(CourseLocator.CourseDeleteUseCase)
  .to(DeleteCourseUseCase)

courseContainer
  .bind<DeleteController>(CourseLocator.CourseDeleteController)
  .to(DeleteCourseController)

courseContainer
  .bind<ActivateEntityRepository<Course>>(CourseLocator.CourseActivateRepository)
  .to(ActivateCourseMongoRepository)

courseContainer
  .bind<ActivateUseCase<Course>>(CourseLocator.CourseActivateUseCase)
  .to(ActivateCourseUseCase)

courseContainer
  .bind<ActivateController<Course>>(CourseLocator.CourseActivateController)
  .to(ActivateCourseController)

courseContainer
  .bind<DeactivateEntityRepository<Course>>(CourseLocator.CourseDeactivateRepository)
  .to(DeactivateCourseMongoRepository)

courseContainer
  .bind<DeactivateUseCase<Course>>(CourseLocator.CourseDeactivateUseCase)
  .to(DeactivateCourseUseCase)

courseContainer
  .bind<DeactivateController<Course>>(CourseLocator.CourseDeactivateController)
  .to(DeactivateCourseController)

courseContainer
  .bind<FindAllController<Course, CourseNameAndIdPM>>(CourseLocator.CourseFindAllNameAndIdController)
  .to(FindAllCourseNameAndIdController)
