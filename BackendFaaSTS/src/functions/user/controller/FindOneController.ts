import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { FindOneController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type User } from '@functions/user/entities/User'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A controller class that handles HTTP GET requests for finding a single User entity.
 */
@injectable()
export class FindOneUserController extends FindOneController<User, UserPresentationModel> {
  /**
   * Creates a new instance of the FindOneUserController class.
   * @param findOneUserUseCase - The FindOneUseCase object that handles the business logic for finding a single User entity.
   * @param userToPresentationModelMapper - The Mapper object that maps User entities to UserPresentationModel objects.
   */
  constructor (
  @inject(UserLocator.UserFindOneUseCase) findOneUserUseCase: FindOneUseCase<User>,
    @inject(UserLocator.UserMapperPresentationModel) userToPresentationModelMapper: Mapper<User, UserPresentationModel>
  ) {
    super(userToPresentationModelMapper, findOneUserUseCase)
  }
}
