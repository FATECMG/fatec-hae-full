import { connectDatabase } from '@common/external/database/MongoDB'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'

import { injectable } from 'inversify'
@injectable()
export class UpdateStatusRepository {
  async perform (id: string, status: string, sendDate?: string): Promise<boolean> {
    await connectDatabase()
    const project = await ProjectModel.findOne({ id }, { _id: 0, __v: 0 })
    if (project == null) return false
    let projectStatus
    if (project.sendDate != null) {
      projectStatus = await ProjectModel.findOneAndUpdate({ id }, { status }, { new: true })
    } else {
      projectStatus = await ProjectModel.findOneAndUpdate({ id }, { status, sendDate }, { new: true })
    }
    return !(projectStatus == null) && projectStatus.status === status
  }
}
