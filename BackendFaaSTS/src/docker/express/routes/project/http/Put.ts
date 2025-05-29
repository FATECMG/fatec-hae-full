import { ProjectDependencies } from '@libs/Inversify'

import { type UpdateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { ProjectUpdateDTO } from '@functions/project/entities/dto/ProjectUpdateDTO'

const putController = ProjectDependencies.get<UpdateController<ProjectUpdateDTO, Project, ProjectPM>>(ProjectControllerLocator.UpdateProjectController)

export const PutProjectHandler = async (req: any, id?: string): Promise<HttpResponse<string | ProjectPM | FieldError | FieldError[]>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const request = req.body
  const param = new ProjectUpdateDTO({
    author: request.author,
    title: request.title,
    notice: request.notice,
    description: request.description,
    complianceModel: request.complianceModel,
    hours: request.hours,
    justification: request.justification,
    references: request.references,
    methodology: request.methodology,
    objectives: request.objectives,
    schedule: request.schedule,
    topicsOfInterest: request.topicsOfInterest,
    status: request.status,
    active: request.active
  })
  const response = await putController.handle(param, id)
  return { data: response.data, statusCode: response.statusCode }
}
