import { type Project } from '@functions/project/entities/Project'
import { type IProjectDocument, ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'

export function toModel (entity: Project): IProjectDocument {
  return new ProjectModel({
    id: entity.id,
    author: {
      id: entity.author.id,
      name: entity.author.name
    },
    notice: {
      id: entity.notice.id,
      title: entity.notice.title
    },
    title: entity.title,
    description: entity.description,
    active: entity.active,
    objectives: entity.objectives,
    topicsOfInterest: entity.topicsOfInterest,
    methodology: entity.methodology,
    justification: entity.justification,
    references: entity.references,
    schedule: entity.schedule,
    sendDate: entity.sendDate,
    hours: entity.hours,
    comments: entity.comments,
    complianceModel: entity.complianceModel,
    status: entity.status
  })
}
