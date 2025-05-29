import 'reflect-metadata'
import { Container } from 'inversify'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import { type EncryptString } from '@common/encryption/Encrypt'
import { BCryptEncrypt } from '@common/utils/encryption/BCryptEncryption'
import {
  type FindOneEntityRepository,
  type FindAllEntityRepository,
  type SaveEntityRepository,
  type UpdateEntityRepository,
  type DeleteEntityRepository,
  type ActivateEntityRepository,
  type DeactivateEntityRepository
} from '@common/repository/RepositoryInterface'
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
  type FindAllController,
  type FindOneController,
  type SaveController, type UpdateController,
  type DeleteController,
  type ActivateController,
  type DeactivateController
} from '@common/domain/Controllers'

import { UserLocator } from '@functions/user/shared/Di.enums'
import { type UserNameAndId, type User } from '@functions/user/entities/User'
import { type UserNameAndIdPresentationModel, type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import {
  UserMapperPresentationModel,
  UserMapper,
  UserMapperNameAndIdPresentationModel,
  UserUpdateMapperPresentationModel,
  UserUpdateMapper
} from '@functions/user/adapter/mapper/User.mapper'
import { type UserDTO } from '@functions/user/entities/dto/UserDTO'
import { UserDTOZodValidation, UserUpdateDTOZodValidation } from '@functions/user/adapter/validation/ZodUserDTOValidation'
import { type UserUpdateDTO } from '@functions/user/entities/dto/UserUpdateDTO'
import { type UserUpdate } from '@functions/user/entities/UserUpdate'
import { FindAllUserUseCase } from '@functions/user/useCases/FindAll'
import { FindAllUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/FindAll'
import { FindAllUserController } from '@functions/user/controller/FindAllController'
import { FindOneUserUseCase } from '@functions/user/useCases/FindOne'
import { FindOneUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/FindOne'
import { FindOneUserController } from '@functions/user/controller/FindOneController'
import { SaveUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/Save'
import { SaveUserController } from '@functions/user/controller/SaveController'
import { SaveUserUseCase } from '@functions/user/useCases/Save'
import { UpdateUserUseCase } from '@functions/user/useCases/Update'
import { UpdateUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/Update'
import { UpdateUserController } from '@functions/user/controller/UpdateController'
import { DeleteUserUseCase } from '@functions/user/useCases/Delete'
import { DeleteUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/Delete'
import { DeleteUserController } from '@functions/user/controller/DeleteController'
import { ActivateUserUseCase } from '@functions/user/useCases/Activate'
import { DeactivateUserUseCase } from '@functions/user/useCases/Deactivate'
import { DeactivateUser } from '@functions/user/controller/DeactivateController'
import { ActivateUser } from '@functions/user/controller/ActivateController'
import { ActivateUserRepository } from '@functions/user/adapter/repositories/MongoDB/Activate'
import { DeactivateUserRepository } from '@functions/user/adapter/repositories/MongoDB/Deactivate'
import { FindAllUserNamesAndIdMongoRepository } from '@functions/user/adapter/repositories/MongoDB/FindAllNamesAndId'
import { FindAllUserNameAndIdUseCase } from '@functions/user/useCases/FindAllNameAndId'
import { FindAllUserNameAndIdController } from '@functions/user/controller/FindAllNameAndId'

export const userContainer = new Container()

userContainer.bind<Mapper<UserUpdate, UserPresentationModel>>(UserLocator.UserUpdateMapperPresentationModel)
  .to(UserUpdateMapperPresentationModel)

userContainer.bind<Mapper<User, UserPresentationModel>>(UserLocator.UserMapperPresentationModel)
  .to(UserMapperPresentationModel)

userContainer.bind<Mapper<UserDTO, User>>(UserLocator.UserMapper)
  .to(UserMapper)

userContainer.bind<Mapper<UserUpdateDTO, UserUpdate>>(UserLocator.UserUpdateMapper)
  .to(UserUpdateMapper)

userContainer.bind<NewValidationSchema>(UserLocator.UserDTOValidationSchema)
  .to(UserDTOZodValidation)

userContainer.bind<NewValidationSchema>(UserLocator.UserUpdateDTOValidationSchema)
  .to(UserUpdateDTOZodValidation)

userContainer.bind<EncryptString>(UserLocator.Encryption)
  .to(BCryptEncrypt)

userContainer.bind<FindAllUseCase<User>>(UserLocator.UserFindAllUseCase)
  .to(FindAllUserUseCase)

userContainer.bind<FindAllEntityRepository<User>>(UserLocator.UserFindAllRepository)
  .to(FindAllUserMongoRepository)

userContainer.bind<FindAllController<User, UserPresentationModel>>(UserLocator.UserFindAllController)
  .to(FindAllUserController)

userContainer.bind<FindOneUseCase<User>>(UserLocator.UserFindOneUseCase)
  .to(FindOneUserUseCase)

userContainer.bind<FindOneEntityRepository<User>>(UserLocator.UserFindOneRepository)
  .to(FindOneUserMongoRepository)

userContainer.bind<FindOneController<User, UserPresentationModel>>(UserLocator.UserFindOneController)
  .to(FindOneUserController)

userContainer.bind<SaveUseCase<User>>(UserLocator.UserSaveUseCase)
  .to(SaveUserUseCase)

userContainer.bind<SaveEntityRepository<User>>(UserLocator.UserSaveRepository)
  .to(SaveUserMongoRepository)

userContainer.bind<SaveController<UserDTO, User, UserPresentationModel>>(UserLocator.UserSaveController)
  .to(SaveUserController)

userContainer.bind<UpdateUseCase<UserUpdate>>(UserLocator.UserUpdateUseCase)
  .to(UpdateUserUseCase)

userContainer.bind<UpdateEntityRepository<UserUpdate>>(UserLocator.UserUpdateRepository)
  .to(UpdateUserMongoRepository)

userContainer.bind<UpdateController<UserUpdateDTO, UserUpdate, UserPresentationModel>>(UserLocator.UserUpdateController)
  .to(UpdateUserController)

userContainer.bind<DeleteUseCase>(UserLocator.UserDeleteUseCase)
  .to(DeleteUserUseCase)

userContainer.bind<DeleteEntityRepository>(UserLocator.UserDeleteRepository)
  .to(DeleteUserMongoRepository)

userContainer.bind<DeleteController>(UserLocator.UserDeleteController)
  .to(DeleteUserController)

userContainer.bind<ActivateController<User>>(UserLocator.UserActivateController)
  .to(ActivateUser)

userContainer.bind<DeactivateController<User>>(UserLocator.UserDeactivateController)
  .to(DeactivateUser)

userContainer.bind<ActivateUseCase<User>>(UserLocator.UserActivateUseCase)
  .to(ActivateUserUseCase)

userContainer.bind<DeactivateUseCase<User>>(UserLocator.UserDeactivateUseCase)
  .to(DeactivateUserUseCase)

userContainer.bind<ActivateEntityRepository<User>>(UserLocator.UserActivateRepository)
  .to(ActivateUserRepository)

userContainer.bind<DeactivateEntityRepository<User>>(UserLocator.UserDeactivateRepository)
  .to(DeactivateUserRepository)

userContainer.bind<FindAllEntityRepository<UserNameAndId>>(UserLocator.UserFindAllNamesAndIdRepository)
  .to(FindAllUserNamesAndIdMongoRepository)

userContainer.bind<FindAllUseCase<UserNameAndId>>(UserLocator.UserFindAllNamesAndIdUseCase)
  .to(FindAllUserNameAndIdUseCase)

userContainer.bind<Mapper<User, UserNameAndId>>(UserLocator.UserNamesAndIdPresentationModelMapper)
  .to(UserMapperNameAndIdPresentationModel)

userContainer.bind<FindAllController<UserNameAndId, UserNameAndIdPresentationModel>>(UserLocator.UserFindAllNamesAndIdController)
  .to(FindAllUserNameAndIdController)
