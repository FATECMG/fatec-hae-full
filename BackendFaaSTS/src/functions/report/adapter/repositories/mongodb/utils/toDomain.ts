import { Report } from '@functions/report/entities/Report'
import { type IReportDocument } from '../model/ReportModel'

export function toDomain (doc: IReportDocument): Report {
  return new Report({
    author: {
      id: doc.author.id,
      name: doc.author.name
    },
    project: {
      id: doc.project.id,
      title: doc.project.title
    },
    activities: doc.activities.map(each => (
      {
        id: each.id,
        description: each.description
      }
    )),
    course: doc.course,
    active: doc.active,
    status: doc.status
  }, doc._id)
}
