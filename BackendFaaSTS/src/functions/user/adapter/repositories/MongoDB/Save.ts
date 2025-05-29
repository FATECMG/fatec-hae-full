import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'
import { EntityNotFoundByNameError, NotFoundError } from '@common/error/NotFoundError'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'

import { type User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { toModel, errorLabel } from '@functions/user/adapter/repositories/MongoDB/utils'
import { RoleModel } from '@functions/role/adapter/repositories/model/RoleMongoModel'

import { injectable } from 'inversify'
import { InfraError } from '@common/error/InfraError'

type PossibleDuplicatedFields = 'registerNumber' | 'email'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'registerNumber'

/**
 * Implementation of the SaveEntityRepository interface that saves a User entity to a MongoDB database.
 */
@injectable()
export class SaveUserMongoRepository implements SaveEntityRepository<User> {
  /**
   * Saves a User entity to a MongoDB database.
   * @param user - The User entity to be saved.
   * @returns A Promise that resolves to the saved User entity.
   * @throws {DuplicatedFieldError} If a field that should be unique (such as register number or email) is duplicated in the database.
    * The error message will contain information about the duplicated field and the value that caused the duplication.
    */
  async perform (user: User): Promise<User> {
    try {
      await connectDatabase()

      await RoleModel.exists({ name: user.roles, active: true })
        .orFail(new EntityNotFoundByNameError(user.roles, 'Cargo'))

      const newUser = new UserModel(toModel(user))
      await newUser.save({ safe: true })
      return user
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
        throw new EntityNotFoundByNameError(error.fieldValue, error.entityName)
      }

      throw new InfraError('Erro inesperado ao salvar usuário!')
    }
  }
}
