import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import {
  type FindAllController,
  type FindOneController,
  type SaveController,
  type UpdateController,
  type DeleteController,
  type ActivateController,
  type DeactivateController
} from '@common/domain/Controllers'

import type userSchema from '@functions/user/adapter/external/web/UserSchema'
import { UserDTO } from '@functions/user/entities/dto/UserDTO'
import { UserLocator } from '@functions/user/shared/Di.enums'
import { type UserPutSchema } from '@functions/user/adapter/external/web/UserSchema'
import { UserUpdateDTO } from '@functions/user/entities/dto/UserUpdateDTO'
import { type UserNameAndId, type User } from '@functions/user/entities/User'
import { type UserNameAndIdPresentationModel, type UserPresentationModel } from '@functions/user/entities/dto/UserPM'

import { UserDependencies } from '@libs/Inversify'
import { type UserUpdate } from '@functions/user/entities/UserUpdate'

const controllers = {
  findOneController: UserDependencies.get<FindOneController<User, UserPresentationModel>>(UserLocator.UserFindOneController),
  findAllController: UserDependencies.get<FindAllController<User, UserPresentationModel>>(UserLocator.UserFindAllController),
  findAllNameAndIdController: UserDependencies.get<FindAllController<UserNameAndId, UserNameAndIdPresentationModel>>(UserLocator.UserFindAllNamesAndIdController),
  saveController: UserDependencies.get<SaveController<UserDTO, User, UserPresentationModel>>(UserLocator.UserSaveController),
  updateController: UserDependencies.get<UpdateController<UserUpdateDTO, UserUpdate, UserPresentationModel>>(UserLocator.UserUpdateController),
  deleteController: UserDependencies.get<DeleteController>(UserLocator.UserDeleteController),
  activateController: UserDependencies.get<ActivateController<User>>(UserLocator.UserActivateController),
  deactiveController: UserDependencies.get<DeactivateController<User>>(UserLocator.UserDeactivateController)
}

const postUserHandler: ValidatedEventAPIGatewayProxyEvent<typeof userSchema> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const request = event.body
      const param = new UserDTO({
        name: request.name,
        roles: request.roles,
        active: request.active,
        email: request.email,
        courses: request.courses,
        password: request.password,
        phone: request.phone,
        registerNumber: request.registerNumber,
        academicTitle: request.academicTitle
      })
      const response = await controllers.saveController.handle(param)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

const getUserHandler: ValidatedEventAPIGatewayProxyEvent<any> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const id = event?.pathParameters?.id
      if (id === undefined) {
        return formatJSONResponse({
          body: 'Invalid path id!'
        }, 404)
      }
      const response = await controllers.findOneController.handle(id)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

const getUsersHandler: ValidatedEventAPIGatewayProxyEvent<any> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      let active: boolean = true
      if (event?.queryStringParameters !== null && event.queryStringParameters.active !== undefined) {
        active = event.queryStringParameters.active !== 'false'
      }
      const response = await controllers.findAllController.handle(active)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

const activateUserHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await controllers.activateController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}
const deactivateUserHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await controllers.deactiveController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

const deleteUserHandler: ValidatedEventAPIGatewayProxyEvent<any> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const id = event?.pathParameters?.id
      if (id === undefined) {
        return formatJSONResponse({
          body: 'Invalid path id!'
        }, 404)
      }
      const response = await controllers.deleteController.handle(id)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

const putUserHandler: ValidatedEventAPIGatewayProxyEvent<typeof UserPutSchema> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const request = event.body
      const id = event?.pathParameters?.id
      if (id === undefined) {
        return formatJSONResponse({
          body: 'Invalid path id!'
        }, 404)
      }
      const argument = new UserUpdateDTO({
        name: request.name,
        roles: request.roles,
        active: request.active,
        email: request.email,
        phone: request.phone,
        courses: request.courses,
        registerNumber: request.registerNumber,
        academicTitle: request.academicTitle
      })
      const response = await controllers.updateController.handle(argument, id)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

const getUsersNameAndIdHandler: ValidatedEventAPIGatewayProxyEvent<any> =
  async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false
    let active: boolean = true
    if (event?.queryStringParameters !== null && event.queryStringParameters.active !== undefined) {
      active = event.queryStringParameters.active !== 'false'
    }
    const response = await controllers.findAllNameAndIdController.handle(active)
    return formatJSONResponse({ body: response.data }, response.statusCode)
  }

export const postUser = middyfy(postUserHandler)
export const getUser = middyfy(getUserHandler)
export const getUsers = middyfy(getUsersHandler)
export const getUsersNameAndId = middyfy(getUsersNameAndIdHandler)
export const deleteUser = middyfy(deleteUserHandler)
export const putUser = middyfy(putUserHandler)
export const activateUser = middyfy(activateUserHandler)
export const deactivateUser = middyfy(deactivateUserHandler)
