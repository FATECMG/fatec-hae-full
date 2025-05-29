import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'

import { injectable } from 'inversify'

@injectable()
export class DeactivateSchoolMongoRepository implements DeactivateEntityRepository<School> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const schoolDeactivated = await SchoolModel.findOneAndUpdate({ id }, { active: false }, { new: true })
    return !(schoolDeactivated == null) && !schoolDeactivated.active
  }
}
