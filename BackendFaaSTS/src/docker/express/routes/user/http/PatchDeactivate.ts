import { type DeactivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { UserDependencies } from '@libs/Inversify'

const deactivateController = UserDependencies.get<DeactivateController<User>>(UserLocator.UserDeactivateController)

export const PatchDeactivateUserHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deactivateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
