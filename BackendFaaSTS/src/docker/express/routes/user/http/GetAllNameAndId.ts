import { type FindAllController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type UserNameAndIdPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { type UserNameAndId } from '@functions/user/entities/User'

import { UserDependencies } from '@libs/Inversify'

const getNameAndIdController = UserDependencies.get<FindAllController<UserNameAndId, UserNameAndIdPresentationModel>>(UserLocator.UserFindAllNamesAndIdController)

export const GetAllUserNameAndIdHandler = async (activeParam?: string): Promise<HttpResponse<UserNameAndIdPresentationModel[]>> => {
  let active: boolean = true
  if (activeParam !== undefined) {
    active = activeParam !== 'false'
  }
  const response = await getNameAndIdController.handle(active)
  return { data: response.data, statusCode: response.statusCode }
}
