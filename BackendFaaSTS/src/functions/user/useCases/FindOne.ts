import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A use case class that handles the business logic for finding a single User entity by ID.
 * Implements the FindOneUseCase interface.
 */
@injectable()
export class FindOneUserUseCase implements FindOneUseCase<User> {
  /**
   * Creates a new instance of the FindOneUserUseCase class.
   * @param findOneUserRepository - The FindOneEntityRepository object that handles the persistence layer for User entities.
   */
  constructor (
    @inject(UserLocator.UserFindOneRepository) private readonly findOneUserRepository: FindOneEntityRepository<User>
  ) {}

  /**
   * Executes the business logic for finding a single User entity by ID.
   * @param id - The ID of the User entity to find.
   * @returns A Promise that resolves to a User entity or a NotFoundError object if the entity is not found.
   */
  async execute (id: string): Promise<User | Error> {
    const result = await this.findOneUserRepository.perform(id)
    return result === undefined ? new IDNotFoundError(id, 'usuário') : result
  }
}
