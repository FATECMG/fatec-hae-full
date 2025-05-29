import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'

import { type School } from '@functions/school/entities/School'
import { toModel, errorLabel } from '@functions/school/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'name'
const possibleDuplicatedFields: PossibleDuplicatedFields = 'name'

@injectable()
export class SaveSchoolMongoRepository implements SaveEntityRepository<School> {
  async perform (school: School): Promise<School> {
    await connectDatabase()
    try {
      const newSchool = toModel(school)
      await newSchool.save({ safe: true })
    } catch (err) {
      if (isMongoDuplicationError(err)) {
        throw new DuplicatedFieldError({
          mongoError: err,
          errorLabel,
          entity: school,
          possibleDuplicatedFields
        })
      }
      throw err
    }
    return school
  }
}
