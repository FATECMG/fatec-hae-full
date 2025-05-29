import { type FindAllFromEntityController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { ProjectDependencies } from '@libs/Inversify'

const getController = ProjectDependencies.get<FindAllFromEntityController<Project, ProjectPM>>(ProjectControllerLocator.FindAllProjectsFromUserController)

export const GetProjectsFromUserHandler = async (id?: string): Promise<HttpResponse<ProjectPM[] | string >> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
