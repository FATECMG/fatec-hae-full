import { type DeleteController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { UserLocator } from '@functions/user/shared/Di.enums'

import { UserDependencies } from '@libs/Inversify'

const deleteController = UserDependencies.get<DeleteController>(UserLocator.UserDeleteController)

export const DeleteUserHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deleteController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
