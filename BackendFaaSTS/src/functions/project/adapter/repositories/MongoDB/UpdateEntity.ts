import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { connectDatabase } from '@common/external/database/MongoDB'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'

import { type Project } from '@functions/project/entities/Project'
import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { errorLabel, toDomain } from '@functions/project/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'title'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'title'

/**
 * A repository class that updates a `Project` entity by its ID.
 */
@injectable()
export class UpdateProjectRepository implements UpdateEntityRepository<Project> {
  /**
   * Updates a `Project` entity by its ID.
   * @param {Project} entity - The `Project` object to update.
   * @param {string} id - The ID of the entity to update.
   * @returns {Promise<Project | undefined>} A `Promise` that resolves to a `Project` object or `undefined` if the entity was not found.
   * @throws {DuplicatedFieldError} If the `title` field of the `Project` object is duplicated.
   */
  async perform (entity: Project, id: string): Promise<Project | undefined> {
    await connectDatabase()
    try {
      const updatedProject = await ProjectModel.findOneAndUpdate({ id }, {
        $set: {
          author: {
            id: entity.author.id,
            name: entity.author.name
          },
          notice: {
            id: entity.notice.id,
            title: entity.notice.title
          },
          title: entity.title,
          description: entity.description,
          objectives: entity.objectives,
          topicsOfInterest: entity.topicsOfInterest,
          methodology: entity.methodology,
          justification: entity.justification,
          references: entity.references,
          schedule: entity.schedule,
          'hours.proposed': entity.hours.proposed,
          'hours.approved': entity.hours.approved,
          complianceModel: entity.complianceModel,
          active: entity.active,
          status: entity.status
        }
      }, { new: true, runValidators: true })

      return updatedProject === null ? undefined : toDomain(updatedProject)
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
  }
}
