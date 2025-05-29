import { type FindOneController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { type User } from '@functions/user/entities/User'

import { UserDependencies } from '@libs/Inversify'

const getController = UserDependencies.get<FindOneController<User, UserPresentationModel>>(UserLocator.UserFindOneController)

export const GetUserHandler = async (id?: string): Promise<HttpResponse<string | UserPresentationModel>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
