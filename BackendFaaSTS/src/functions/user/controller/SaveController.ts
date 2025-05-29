import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { SaveController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'

import { type User } from '@functions/user/entities/User'
import { type UserDTO } from '@functions/user/entities/dto/UserDTO'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A controller class that handles HTTP POST requests for creating a new User entity.
 * */
@injectable()
export class SaveUserController extends SaveController<UserDTO, User, UserPresentationModel> {
  /**
   * Creates a new instance of the SaveUserController class.
   * @param dtoValidator - The NewValidationSchema object that validates UserDTO objects.
   * @param dtoToEntityMapper - The Mapper object that maps UserDTO objects to User entities.
   * @param entityToPresentationModelMapper - The Mapper object that maps User entities to UserPresentationModel objects.
   * @param entityUseCase - The SaveUseCase object that handles the business logic for saving User entities.
   */
  constructor (
  @inject(UserLocator.UserDTOValidationSchema) dtoValidator: NewValidationSchema,
    @inject(UserLocator.UserMapper) dtoToEntityMapper: Mapper<UserDTO, User>,
    @inject(UserLocator.UserMapperPresentationModel) entityToPresentationModelMapper: Mapper<User, UserPresentationModel>,
    @inject(UserLocator.UserSaveUseCase) entityUseCase: SaveUseCase<User>
  ) {
    super(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, entityUseCase)
  }
}
