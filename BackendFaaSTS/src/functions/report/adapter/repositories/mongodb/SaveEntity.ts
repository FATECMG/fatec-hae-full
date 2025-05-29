import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { type Report } from '@functions/report/entities/Report'
import { toDomain } from './utils/toDomain'
import { ReportModel } from './model/ReportModel'

import { connectDatabase } from '@common/external/database/MongoDB'
import { injectable } from 'inversify'

@injectable()
export class SaveReportRepository implements SaveEntityRepository<Report> {
  async perform (entity: Report): Promise<Report> {
    await connectDatabase()
    try {
      const result = await ReportModel.findOneAndUpdate({ 
        'project.id': entity.project.id, active: true
       }, {
        $set: {
          'project.id': entity.project.id,
          'project.title': entity.project.title,
          'author.id': entity.author.id,
          'author.name': entity.author.name,
           activities: entity.activities,
           course: entity.course,
           active: entity.active,
           status: entity.status
        }
       }, { upsert: true, new: true })
      return toDomain(result)
    } catch (err) {
      return await Promise.reject(err)
    }
  }
}
