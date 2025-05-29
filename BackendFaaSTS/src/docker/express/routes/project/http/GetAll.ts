import { ProjectDependencies } from '@libs/Inversify'

import { type HttpResponse } from '@common/http/Types'

import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { type FindAllProjectController } from '@functions/project/controller/FindAll'

const getController = ProjectDependencies.get<FindAllProjectController>(ProjectControllerLocator.FindAllProjectController)

export const GetAllProjectHandler = async (params: any, token: string): Promise<HttpResponse<ProjectPM[] | string>> => {
  const filter = ProjectFilter.create(params)
  const response = await getController.handle(filter, token)
  return { data: response.data, statusCode: response.statusCode }
}
