import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { type UserNameAndId } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A use case class that handles the business logic for finding all User names and ids.
 * Implements the FindAllUseCase interface.
 */
@injectable()
export class FindAllUserNameAndIdUseCase implements FindAllUseCase<UserNameAndId> {
  /**
   * Creates a new instance of the FindAllUserUseCase class.
   * @param userRepository - The FindAllEntityRepository object that handles the persistence layer for UserNameAndId entities.
   */
  constructor (@inject(UserLocator.UserFindAllNamesAndIdRepository) private readonly userRepository: FindAllEntityRepository<UserNameAndId>) {}

  /**
   * Executes the business logic for finding all UserNameAndId entities.
   * @returns A Promise that resolves to an array of UserNameAndId entities.
   */
  async execute (active: boolean): Promise<UserNameAndId[]> {
    return await this.userRepository.perform(active)
  }
}
