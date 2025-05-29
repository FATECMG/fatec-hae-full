import { type Report } from '@functions/report/entities/Report'
import { type IReportDocument, ReportModel } from '../model/ReportModel'

export function toModel (entity: Report): IReportDocument {
  return new ReportModel({
    id: entity.id,
    author: {
      id: entity.author.id,
      name: entity.author.name
    },
    project: {
      id: entity.project.id,
      title: entity.project.title
    },
    activities: entity.activities.map(each => (
      {
        id: each.id,
        description: each.description
      }
    )),
    course: entity.course,
    status: entity.status,
    active: entity.active
  }
  )
}
