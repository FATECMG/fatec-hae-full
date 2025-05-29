import { ProjectDependencies } from '@libs/Inversify'

import { type DeleteController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const deleteController = ProjectDependencies.get<DeleteController>(ProjectControllerLocator.DeleteProjectController)

export const DeleteProjectHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deleteController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
