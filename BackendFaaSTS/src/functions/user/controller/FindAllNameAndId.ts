import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { FindAllController } from '@common/domain/Controllers'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type UserNameAndId } from '@functions/user/entities/User'
import { type UserNameAndIdPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A controller class that handles HTTP GET requests for finding all UserNameAndId entities.
 */
@injectable()
export class FindAllUserNameAndIdController extends FindAllController<UserNameAndId, UserNameAndIdPresentationModel> {
  /**
   * Creates a new instance of the FindAllUserNameAndIdController class.
   * @param entityToPresentationModelMapper - The Mapper object that maps UserNameAndId entities to UserNameAndIdPresentationModel objects.
   * @param findAllUseCase - The FindAllUseCase object that handles the business logic for finding all UserNameAndId entities.
   */
  constructor (
  @inject(UserLocator.UserNamesAndIdPresentationModelMapper) entityToPresentationModelMapper: Mapper<UserNameAndId, UserNameAndIdPresentationModel>,
    @inject(UserLocator.UserFindAllNamesAndIdUseCase) findAllUseCase: FindAllUseCase<UserNameAndId>
  ) {
    super(entityToPresentationModelMapper, findAllUseCase)
  }
}
