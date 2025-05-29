import { type HttpResponse } from '@common/http/Types'

import { type RoleController } from '@functions/role/controller/RoleController'
import { type Role } from '@functions/role/entities/Role'
import { RoleContainer } from '@functions/role/shared/Di.container'
import { RoleLocator } from '@functions/role/shared/Di.enums'

const getController = RoleContainer.get<RoleController>(RoleLocator.RoleController)

export const GetAllRoleHandler = async (): Promise<HttpResponse<string | Role[]>> => {
  const response = await getController.handle()
  return { data: response.data, statusCode: response.statusCode }
}
