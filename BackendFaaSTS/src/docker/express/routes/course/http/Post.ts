import { type SaveController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { type Course } from '@functions/course/entities/Course'
import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { courseContainer } from '@functions/course/shared/Di.container'
import { CourseLocator } from '@functions/course/shared/Di.enums'

const saveController = courseContainer.get<SaveController<CourseDTO, Course, CoursePresentationModel>>(CourseLocator.CourseCreateController)

export const PostCourseHandler = async (req: any): Promise<HttpResponse<string | CoursePresentationModel | FieldError | FieldError[]>> => {
  const request = req.body
  const param: CourseDTO = {
    name: request.name,
    active: request.active,
    coordinator: request.coordinator,
    schedule: [...request.schedule],
    code: request.code,
    acronym: request.acronym
  }
  const response = await saveController.handle(param)
  return { data: response.data, statusCode: response.statusCode }
}
