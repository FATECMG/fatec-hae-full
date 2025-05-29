import { type FindAllController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { type User } from '@functions/user/entities/User'

import { UserDependencies } from '@libs/Inversify'

const getController = UserDependencies.get<FindAllController<User, UserPresentationModel>>(UserLocator.UserFindAllController)

export const GetAllUserHandler = async (activeParam?: string): Promise<HttpResponse<UserPresentationModel[]>> => {
  let active: boolean = true
  if (activeParam !== undefined) {
    active = activeParam !== 'false'
  }
  const response = await getController.handle(active)
  return { data: response.data, statusCode: response.statusCode }
}
