import { ProjectDependencies } from '@libs/Inversify'

import { type DeactivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Project } from '@functions/project/entities/Project'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const deactivateController = ProjectDependencies.get<DeactivateController<Project>>(ProjectControllerLocator.DeactivateProjectController)

export const PatchDeactivateProjectHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deactivateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
