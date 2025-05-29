import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { AuthSignUpUseCase } from '@common/auth/SignUpUseCase.interface'
import { FindOneEntityRepository, type SaveEntityRepository } from '@common/repository/RepositoryInterface'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { ValidationError } from '@common/error/ValidationError'
import { AuthenticationError } from '@common/error/AuthenticationError'

import { type Course } from '@functions/course/entities/Course'
import { type User } from '@functions/user/entities/User'

import { CourseLocator } from '@functions/course/shared/Di.enums'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { AuthLocator } from '@functions/auth/shared/Di.enums'

import { type EncryptString } from '@common/encryption/Encrypt'
import { PasswordPolicyValidator } from '@functions/passwordvalidation/adapter/validation/PasswordPolicy'

import { inject, injectable } from 'inversify'

/**
 * A use case class that handles the business logic for saving a User entity.
 * Implements the SaveUseCase interface and.
 */
@injectable()
export class SaveUserUseCase implements SaveUseCase<User> {
  /**
   * Creates a new instance of the SaveUserUseCase class.
   * @param userRepository - The SaveEntityRepository object that handles the persistence layer for User entities.
   * @param courseRepository - The FindOneEntityRepository object that handles the persistence layer for Course entities.
   * @param signUpUseCase - The AuthSignUpUseCase object that handles the business logic for signing up a user.
   */
  constructor (
    @inject(UserLocator.UserSaveRepository)
    private readonly userRepository: SaveEntityRepository<User>,
    @inject(CourseLocator.CourseFindOneRepository)
    private readonly courseRepository: FindOneEntityRepository<Course>,
    @inject(AuthLocator.SignUpUseCase)
    private readonly signUpUseCase: AuthSignUpUseCase,
    @inject(UserLocator.Encryption)
    private readonly hashService: EncryptString
  ) {}

  /**
   * Executes the business logic for saving a User entity.
   * @param user - The User entity to save.
   * @returns A Promise that resolves to the saved User entity or a DuplicatedFieldError or InfraError object if an error occurs.
   */
  async execute (user: User): Promise<User | Error> {
    try {
      await Promise.all(user.courses.map(async each => {
        const foundCourse = await this.courseRepository.perform(each.id)
        if (foundCourse === undefined) {
          throw new IDNotFoundError(each.id, 'Curso')
        }
        each.name = foundCourse.name
      }))

      PasswordPolicyValidator.validate(user.password)

      const userCreated = await this.userRepository.perform({
        ...user,
        password: this.hashService.hashPassword(user.password)
      })

      if (userCreated instanceof Error) { throw userCreated }

      const result = await this.signUpUseCase.execute({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles,
        password: user.password
      })

      console.log('cognito result', result)

      return userCreated
    } catch (error) {
      if (error instanceof DuplicatedFieldError || error instanceof NotFoundError) { return error }
      if (error instanceof ValidationError) { return error }
      if (error instanceof AuthenticationError) { return error }
    }
    return new InfraError('Erro inesperado!')
  }
}
