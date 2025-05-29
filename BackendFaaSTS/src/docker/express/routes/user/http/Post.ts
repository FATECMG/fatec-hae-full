import { type SaveController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { UserDTO } from '@functions/user/entities/dto/UserDTO'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { type User } from '@functions/user/entities/User'

import { UserDependencies } from '@libs/Inversify'

const saveController = UserDependencies.get<SaveController<UserDTO, User, UserPresentationModel>>(UserLocator.UserSaveController)

export const PostUserHandler = async (req: any): Promise<HttpResponse<string | UserPresentationModel | FieldError | FieldError[]>> => {
  const request = req.body
  const param = new UserDTO({
    name: request.name,
    roles: request.roles,
    active: request.active,
    email: request.email,
    password: request.password,
    courses: request.courses,
    phone: request.phone,
    registerNumber: request.registerNumber,
    academicTitle: request.academicTitle
  })
  const response = await saveController.handle(param)
  return { data: response.data, statusCode: response.statusCode }
}
