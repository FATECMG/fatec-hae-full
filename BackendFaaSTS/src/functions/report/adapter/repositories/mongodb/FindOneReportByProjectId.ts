import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { type Report } from '@functions/report/entities/Report'
import { toDomain } from '@functions/report/adapter/repositories/mongodb/utils/toDomain'
import { ReportModel } from '@functions/report/adapter/repositories/mongodb/model/ReportModel'

import { connectDatabase } from '@common/external/database/MongoDB'
import { injectable } from 'inversify'

@injectable()
export class FindOneReportByProjectIdRepository implements FindOneEntityRepository<Report> {
  async perform (id: string): Promise<Report | undefined> {
    await connectDatabase()
    try {
      const result = await ReportModel.findOne({ 'project.id': id, active: true })
       return result === null ? undefined : toDomain(result)
    } catch (err) {
      return await Promise.reject(err)
    }
  }
}