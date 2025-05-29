import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A use case class that handles the business logic for finding all User entities.
 * Implements the FindAllUseCase interface.
 */
@injectable()
export class FindAllUserUseCase implements FindAllUseCase<User> {
  /**
   * Creates a new instance of the FindAllUserUseCase class.
   * @param userRepository - The FindAllEntityRepository object that handles the persistence layer for User entities.
   */
  constructor (@inject(UserLocator.UserFindAllRepository) private readonly userRepository: FindAllEntityRepository<User>) {}

  /**
   * Executes the business logic for finding all User entities.
   * @returns A Promise that resolves to an array of User entities.
   */
  async execute (active: boolean): Promise<User[]> {
    return await this.userRepository.perform(active)
  }
}
