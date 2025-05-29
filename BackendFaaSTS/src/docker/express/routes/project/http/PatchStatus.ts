import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { ProjectDependencies } from '@libs/Inversify'

import { type HttpResponse } from '@common/http/Types'
import { type HandleUpdateProjectStatusController } from '@functions/project/controller/UpdateProjectStatus'
import { type FieldError } from '@common/error/ValidationError'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'

const updateProjectStatusController = ProjectDependencies
  .get<HandleUpdateProjectStatusController>(ProjectControllerLocator.UpdateProjectStatusController)

export const PatchProjectStatusHandler = async (id?: string, statusParam?: string, token?: string):
Promise<HttpResponse<ProjectPM | FieldError | FieldError[] | string>> => {
  if (statusParam === undefined) {
    return { data: 'Status code is required!', statusCode: 404 }
  }

  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }

  if (token === undefined) {
    return { data: 'Not Authenticated!', statusCode: 401 }
  }
  const response = await updateProjectStatusController.handle(id, statusParam, token)
  return { data: response.data, statusCode: response.statusCode }
}
