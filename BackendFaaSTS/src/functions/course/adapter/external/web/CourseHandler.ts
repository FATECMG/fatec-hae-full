import { middyfy } from '@libs/Lambda'
import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'

import {
  type FindAllController,
  type FindOneController,
  type SaveController,
  type UpdateController,
  type DeleteController,
  type ActivateController,
  type DeactivateController
} from '@common/domain/Controllers'

import type CourseSchema from '@functions/course/adapter/external/web/CourseSchema'
import { CourseLocator } from '@functions/course/shared/Di.enums'
import { courseContainer } from '@functions/course/shared/Di.container'
import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { type Course } from '@functions/course/entities/Course'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { type CourseNameAndIdPM } from '@functions/course/entities/pm/CourseNameAndIdPM'

const controllers = {
  findOneController: courseContainer.get<FindOneController<Course, CoursePresentationModel>>(CourseLocator.CourseFindOneController),
  findAllController: courseContainer.get<FindAllController<Course, CoursePresentationModel>>(CourseLocator.CourseFindAllController),
  findAllNameAndIdController: courseContainer.get<FindAllController<Course, CourseNameAndIdPM>>(CourseLocator.CourseFindAllNameAndIdController),
  saveController: courseContainer.get<SaveController<CourseDTO, Course, CoursePresentationModel>>(CourseLocator.CourseCreateController),
  updateController: courseContainer.get<UpdateController<CourseDTO, Course, CoursePresentationModel>>(CourseLocator.CourseUpdateController),
  deleteController: courseContainer.get<DeleteController>(CourseLocator.CourseDeleteController),
  activateController: courseContainer.get<ActivateController<Course>>(CourseLocator.CourseActivateController),
  deactiveController: courseContainer.get<DeactivateController<Course>>(CourseLocator.CourseDeactivateController)
}

const postCourseHandler: ValidatedEventAPIGatewayProxyEvent<typeof CourseSchema> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const request = event.body
      const param: CourseDTO = {
        name: request.name,
        active: request.active,
        coordinator: request.coordinator,
        schedule: [...request.schedule],
        code: request.code,
        acronym: request.acronym
      }
      const response = await controllers.saveController.handle(param)
      return formatJSONResponse({
        body: response.data
      }, response.statusCode)
    }

const getCoursesHandler: ValidatedEventAPIGatewayProxyEvent<any> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      let active: boolean = true
      if (event?.queryStringParameters !== null && event.queryStringParameters.active !== undefined) {
        active = event.queryStringParameters.active !== 'false'
      }
      const response = await controllers.findAllController.handle(active)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

const getCourseHandler: ValidatedEventAPIGatewayProxyEvent<any> =
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

const deleteCourseHandler: ValidatedEventAPIGatewayProxyEvent<any> =
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

const deactivateCourseHandler: ValidatedEventAPIGatewayProxyEvent<any> =
    async (event, context) => {
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

const activateCourseHandler: ValidatedEventAPIGatewayProxyEvent<any> =
    async (event, context) => {
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

const putCourseHandler: ValidatedEventAPIGatewayProxyEvent<typeof CourseSchema> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const id = event.pathParameters?.id
      const request = event.body
      if (id === undefined) {
        return formatJSONResponse({
          body: 'Invalid path id!'
        }, 400)
      }
      const param: CourseDTO = {
        name: request.name,
        active: request.active,
        coordinator: request.coordinator,
        schedule: [...request.schedule],
        code: request.code,
        acronym: request.acronym
      }
      const response = await controllers.updateController.handle(param, id)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

const getCourseNameAndIdHandler: ValidatedEventAPIGatewayProxyEvent<any> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      let active: boolean = true
      if (event?.queryStringParameters !== null && event.queryStringParameters.active !== undefined) {
        active = event.queryStringParameters.active !== 'false'
      }
      const response = await controllers.findAllNameAndIdController.handle(active)
      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

export const postCourse = middyfy(postCourseHandler)
export const getCourses = middyfy(getCoursesHandler)
export const getCourse = middyfy(getCourseHandler)
export const deleteCourse = middyfy(deleteCourseHandler)
export const putCourse = middyfy(putCourseHandler)
export const deactivateCourse = middyfy(deactivateCourseHandler)
export const activateCourse = middyfy(activateCourseHandler)
export const getCourseNameAndId = middyfy(getCourseNameAndIdHandler)
