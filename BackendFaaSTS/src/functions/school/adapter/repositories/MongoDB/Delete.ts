import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'

import { injectable } from 'inversify'

@injectable()
export class DeleteSchoolMongoRepository implements DeleteEntityRepository {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const schoolDeleted = await SchoolModel.findOneAndDelete({ id })
    return schoolDeleted !== null
  }
}
