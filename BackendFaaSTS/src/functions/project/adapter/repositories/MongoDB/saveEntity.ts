import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'

import { type Project } from '@functions/project/entities/Project'
import { errorLabel, toModel } from '@functions/project/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'title'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'title'

/**
 * A repository class that saves a `Project` entity to the database.
 */
@injectable()
export class SaveProjectRepository implements SaveEntityRepository<Project> {
  /**
   * Saves a `Project` entity to the database.
   * @param {Project} entity - The `Project` object to save.
   * @returns {Promise<Project>} A `Promise` that resolves to the saved `Project` object.
   * @throws {DuplicatedFieldError} If a field of the `Project` object is duplicated in the database.
   */
  async perform (entity: Project): Promise<Project> {
    await connectDatabase()
    try {
      const newProject = toModel(entity)
      await newProject.save()
    } catch (err) {
      if (isMongoDuplicationError(err)) {
        throw new DuplicatedFieldError({
          mongoError: err,
          errorLabel,
          entity,
          possibleDuplicatedFields
        })
      }
    }
    return entity
  }
}
