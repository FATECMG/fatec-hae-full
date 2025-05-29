import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { UpdateController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'

import { type UserUpdate } from '@functions/user/entities/UserUpdate'
import { type UserUpdateDTO } from '@functions/user/entities/dto/UserUpdateDTO'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A controller class that handles HTTP PUT requests for updating a User entity.
 */
@injectable()
export class UpdateUserController extends UpdateController<UserUpdateDTO, UserUpdate, UserPresentationModel> {
  /**
   * Creates a new instance of the UpdateUserController class.
   * @param dtoValidator - The NewValidationSchema object that validates UserUpdateDTO objects.
   * @param dtoToEntityMapper - The Mapper object that maps UserUpdateDTO objects to User entities.
   * @param entityToPresentationModelMapper - The Mapper object that maps User entities to UserPresentationModel objects.
   * @param entityUseCase - The UpdateUseCase object that handles the business logic for updating a User entity.
   */
  constructor (
  @inject(UserLocator.UserUpdateDTOValidationSchema) dtoValidator: NewValidationSchema,
    @inject(UserLocator.UserUpdateMapper) dtoToEntityMapper: Mapper<UserUpdateDTO, UserUpdate>,
    @inject(UserLocator.UserUpdateMapperPresentationModel) entityToPresentationModelMapper: Mapper<UserUpdate, UserPresentationModel>,
    @inject(UserLocator.UserUpdateUseCase) entityUseCase: UpdateUseCase<UserUpdate>
  ) {
    super(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, entityUseCase)
  }
}
