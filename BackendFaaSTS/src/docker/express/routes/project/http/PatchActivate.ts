import { ProjectDependencies } from '@libs/Inversify'

import { type ActivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Project } from '@functions/project/entities/Project'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const activateController = ProjectDependencies.get<ActivateController<Project>>(ProjectControllerLocator.ActivateProjectController)

export const PatchActivateProjectHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await activateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
