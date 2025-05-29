import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { FindOneEntityRepository, type UpdateEntityRepository } from '@common/repository/RepositoryInterface'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { ValidationError } from '@common/error/ValidationError'

import { type Course } from '@functions/course/entities/Course'
import { type User } from '@functions/user/entities/User'
import { type UserUpdate } from '@functions/user/entities/UserUpdate'

import { AuthenticationService } from '@common/auth/AuthenticationService.interface'

import { CourseLocator } from '@functions/course/shared/Di.enums'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A use case class that handles the business logic for updating a User entity by ID.
 * Implements the UpdateUseCase interface.
 */
@injectable()
export class UpdateUserUseCase implements UpdateUseCase<UserUpdate> {
  /**
   * Creates a new instance of the UpdateUserUseCase class.
   * @param userRepository - The UpdateEntityRepository object that handles the persistence layer for User entities.
   * @param courseRepository - The FindOneEntityRepository object that handles the persistence layer for Course entities.
   * @param userFindOneRepository - The FindOneEntityRepository object that handles the persistence layer for User entities.
   * @param authService - The AuthenticationService object that handles the business logic for authentication.
   */
  constructor (
    @inject(UserLocator.UserUpdateRepository)
    private readonly userRepository: UpdateEntityRepository<UserUpdate>,
    @inject(CourseLocator.CourseFindOneRepository)
    private readonly courseRepository: FindOneEntityRepository<Course>,
    @inject(UserLocator.UserFindOneRepository)
    private readonly userFindOneRepository: FindOneEntityRepository<User>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: AuthenticationService
  ) {}

  /**
   * Executes the business logic for updating a User entity by ID.
   * @param id - The ID of the User entity to update.
   * @param newUser - The new User entity to update.
   * @returns A Promise that resolves to the updated User entity or a NotFoundError, DuplicatedFieldError or InfraError object if an error occurs.
   */
  async execute (id: string, updatedUser: UserUpdate): Promise<UserUpdate | Error> {
    try {
      const foundUser = await this.userFindOneRepository.perform(id)
      if (foundUser === undefined || !foundUser.active) {
        throw new IDNotFoundError(id, 'usuário')
      }

      await Promise.all(updatedUser.courses.map(async each => {
        const foundCourse = await this.courseRepository.perform(each.id)
        if (foundCourse === undefined) {
          throw new IDNotFoundError(each.id, 'Curso')
        }
      }))

      const userUpdated =
          await this.userRepository.perform(updatedUser, id) ?? new IDNotFoundError(id, 'usuário')

      await this.authService.updateUserData({
        email: foundUser.email,
        name: updatedUser.name,
        role: updatedUser.roles
      })

      updatedUser.id = id

      return userUpdated
    } catch (error) {
      if (error instanceof DuplicatedFieldError || error instanceof NotFoundError) { return error }
      if (error instanceof ValidationError) { return error }
    }
    return new InfraError('Erro inesperado!')
  }
}
