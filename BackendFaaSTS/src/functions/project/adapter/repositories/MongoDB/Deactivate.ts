import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { type Project } from '@functions/project/entities/Project'

import { injectable } from 'inversify'

@injectable()
export class DeactivateProjectRepository implements DeactivateEntityRepository<Project> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const projectDeactivated = await ProjectModel.findOneAndUpdate({ id }, { active: false }, { new: true })
    return !(projectDeactivated == null) && !projectDeactivated.active
  }
}
