import { ProjectDependencies } from '@libs/Inversify'

import { type SaveController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { type Project } from '@functions/project/entities/Project'
import { ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const saveController = ProjectDependencies.get<SaveController<ProjectDTO, Project, ProjectPM>>(ProjectControllerLocator.SaveProjectController)

export const PostProjectHandler = async (req: any): Promise<HttpResponse<string | ProjectPM | FieldError | FieldError[]>> => {
  const request = req.body
  const param = new ProjectDTO({
    author: request.author,
    title: request.title,
    notice: request.notice,
    description: request.description,
    complianceModel: request.complianceModel,
    proposedHours: request.proposedHours,
    justification: request.justification,
    references: request.references,
    methodology: request.methodology,
    objectives: request.objectives,
    schedule: request.schedule,
    topicsOfInterest: request.topicsOfInterest,
    active: request.active
  })
  const response = await saveController.handle(param)
  return { data: response.data, statusCode: response.statusCode }
}
