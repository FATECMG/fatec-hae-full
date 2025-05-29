import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { FindAllController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type User } from '@functions/user/entities/User'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A controller class that handles HTTP GET requests for finding all User entities.
 */
@injectable()
export class FindAllUserController extends FindAllController<User, UserPresentationModel> {
  /**
   * Creates a new instance of the FindAllUserController class.
   * @param entityToPresentationModelMapper - The Mapper object that maps User entities to UserPresentationModel objects.
   * @param findAllUseCase - The FindAllUseCase object that handles the business logic for finding all User entities.
   */
  constructor (
  @inject(UserLocator.UserMapperPresentationModel) entityToPresentationModelMapper: Mapper<User, UserPresentationModel>,
    @inject(UserLocator.UserFindAllUseCase) findAllUseCase: FindAllUseCase<User>
  ) {
    super(entityToPresentationModelMapper, findAllUseCase)
  }
}
