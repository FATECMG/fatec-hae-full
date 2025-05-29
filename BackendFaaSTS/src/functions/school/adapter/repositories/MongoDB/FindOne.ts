import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'
import { toDomain } from '@functions/school/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

@injectable()
export class FindOneSchoolMongoRepository implements FindOneEntityRepository<School> {
  async perform (id: string): Promise<School | undefined> {
    await connectDatabase()
    const result = await SchoolModel.findOne({ id })
    return result === null ? undefined : toDomain(result)
  }
}
