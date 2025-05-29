import { connectDatabase } from '@common/external/database/MongoDB'
import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { type Project } from '@functions/project/entities/Project'

import { injectable } from 'inversify'

@injectable()
export class ActivateProjectRepository implements ActivateEntityRepository<Project> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const projectActivated = await ProjectModel.findOneAndUpdate({ id }, { active: true }, { new: true })
    return !(projectActivated == null) && projectActivated.active
  }
}
