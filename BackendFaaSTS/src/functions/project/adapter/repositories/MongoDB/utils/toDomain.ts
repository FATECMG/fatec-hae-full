import { type IProjectDocument } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { Project } from '@functions/project/entities/Project'

export function toDomain (doc: IProjectDocument): Project {
  return new Project({
    author: {
      id: doc.author.id,
      name: doc.author.name
    },
    notice: {
      id: doc.notice.id,
      title: doc.notice.title
    },
    title: doc.title,
    description: doc.description,
    active: doc.active,
    objectives: doc.objectives,
    topicsOfInterest: doc.topicsOfInterest,
    methodology: doc.methodology,
    justification: doc.justification,
    references: doc.references,
    schedule: doc.schedule,
    sendDate: doc.sendDate,
    hours: doc.hours,
    complianceModel: doc.complianceModel,
    comments: doc.comments,
    status: doc.status
  }, doc.id)
}
