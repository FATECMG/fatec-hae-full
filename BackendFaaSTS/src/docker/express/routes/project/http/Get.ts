import { ProjectDependencies } from '@libs/Inversify'

import { type FindOneController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'

const getController = ProjectDependencies.get<FindOneController<Project, ProjectPM>>(ProjectControllerLocator.FindOneProjectController)

export const GetProjectHandler = async (id?: string): Promise<HttpResponse<string | ProjectPM>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
