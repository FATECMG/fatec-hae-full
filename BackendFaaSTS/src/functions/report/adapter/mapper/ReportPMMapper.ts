import { type Mapper } from '@common/mapper/BaseMapper'
import { type Report } from '@functions/report/entities/Report'
import { type ReportPM } from '@functions/report/entities/pm/ReportPM'

import { injectable } from 'inversify'

@injectable()
export class ReportPresentationModelMapper implements Mapper<Report, ReportPM> {
  async execute (entity: Report, images?: string[]): Promise<ReportPM> {
    return {
      id: entity.id,
      author: {
        id: entity.author.id,
        name: entity.author.name
      },
      activities: entity.activities.map(each => (
        {
          id: each.id,
          description: each.description
        }
      )),
      project: {
        id: entity.project.id,
        title: entity.project.title
      }, 
      images: images || [],
      status: entity.status,
      active: entity.active
    }
  }
}
