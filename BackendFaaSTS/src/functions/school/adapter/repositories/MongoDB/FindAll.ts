import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'
import { toDomain } from '@functions/school/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

@injectable()
export class FindAllSchoolMongoRepository implements FindAllEntityRepository<School> {
  async perform (active: boolean): Promise<School[]> {
    await connectDatabase()
    const result = await SchoolModel.find({ active })
    return result.map(eachDoc => toDomain(eachDoc))
  }
}
