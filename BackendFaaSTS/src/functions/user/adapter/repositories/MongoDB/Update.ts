import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import {
  EntityNotFoundByNameError,
  NotFoundError
} from '@common/error/NotFoundError'

import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import {
  toDomain,
  errorLabel
} from '@functions/user/adapter/repositories/MongoDB/utils'
import { RoleModel } from '@functions/role/adapter/repositories/model/RoleMongoModel'
import { type UserUpdate } from '@functions/user/entities/UserUpdate'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'registerNumber' | 'email'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'registerNumber'

/**
 * Implementation of the UpdateEntityRepository interface that updates a User entity in a MongoDB database.
 */
@injectable()
export class UpdateUserMongoRepository implements UpdateEntityRepository<UserUpdate> {
  /**
     * Updates a User entity in a MongoDB database.
     * @param user - The updated User entity.
     * @param id - The ID of the User entity to be updated.
     * @returns A Promise that resolves to the updated User entity, or undefined if the entity was not found.
     * @throws {DuplicatedFieldError} If a field that should be unique (such as register number or email) is duplicated in the database.
     * The error message will contain information about the duplicated field and the value that caused the duplication.
     */
  async perform (user: UserUpdate, id: string): Promise<UserUpdate | undefined> {
    await connectDatabase()
    try {
      await RoleModel.exists({ name: user.roles, active: true }).orFail(
        new EntityNotFoundByNameError(user.roles, 'Cargo')
      )

      const updatedUser = await UserModel.findOneAndUpdate(
        { id, active: true },
        {
          $set: {
            name: user.name,
            phone: user.phone,
            roles: user.roles,
            email: user.email,
            courses: user.courses,
            registerNumber: user.registerNumber,
            academicTitle: user.academicTitle,
            active: user.active
          }
        },
        { new: true, runValidators: true }
      )
      return updatedUser === null ? undefined : toDomain(updatedUser)
    } catch (error) {
      if (isMongoDuplicationError(error)) {
        throw new DuplicatedFieldError({
          mongoError: error,
          errorLabel,
          entity: user,
          possibleDuplicatedFields
        })
      }

      if (error instanceof NotFoundError) {
        throw new EntityNotFoundByNameError(
          error.fieldValue,
          error.entityName
        )
      }
      throw new Error('Erro inesperado ao atualizar usuário!')
    }
  }
}
