import { connectDatabase } from '@common/external/database/MongoDB'
import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type School } from '@functions/school/entities/School'
import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'

import { injectable } from 'inversify'

@injectable()
export class ActivateSchoolMongoRepository implements ActivateEntityRepository<School> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const schoolActivated = await SchoolModel.findOneAndUpdate({ id }, { active: true }, { new: true })
    return !(schoolActivated == null) && schoolActivated.active
  }
}
