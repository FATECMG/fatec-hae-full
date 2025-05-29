import { type UpdateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { type Course } from '@functions/course/entities/Course'
import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { courseContainer } from '@functions/course/shared/Di.container'
import { CourseLocator } from '@functions/course/shared/Di.enums'

const putController = courseContainer.get<UpdateController<CourseDTO, Course, CoursePresentationModel>>(CourseLocator.CourseUpdateController)

export const PutCourseHandler = async (req: any, id?: string): Promise<HttpResponse<string | CoursePresentationModel | FieldError | FieldError[]>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const request = req.body
  const param: CourseDTO = {
    name: request.name,
    active: request.active,
    coordinator: request.coordinator,
    schedule: [...request.schedule],
    code: request.code,
    acronym: request.acronym
  }
  const response = await putController.handle(param, id)
  return { data: response.data, statusCode: response.statusCode }
}
