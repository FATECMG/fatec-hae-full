import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'

import { type School } from '@functions/school/entities/School'
import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'
import { toDomain, errorLabel } from '@functions/school/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'name'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'name'

@injectable()
export class UpdateSchoolMongoRepository implements UpdateEntityRepository<School> {
  async perform (entity: School, id: string): Promise<School | undefined> {
    await connectDatabase()
    try {
      const updatedSchool = await SchoolModel.findOneAndUpdate({ id }, {
        $set: {
          name: entity.name,
          active: entity.active,
          address: entity.address
        }
      }, { new: true, runValidators: true })

      return updatedSchool === null ? undefined : toDomain(updatedSchool)
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
