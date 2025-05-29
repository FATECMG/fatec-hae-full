import { type FindOneController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Course } from '@functions/course/entities/Course'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { courseContainer } from '@functions/course/shared/Di.container'
import { CourseLocator } from '@functions/course/shared/Di.enums'

const getController = courseContainer.get<FindOneController<Course, CoursePresentationModel>>(CourseLocator.CourseFindOneController)

export const GetCourseHandler = async (id?: string): Promise<HttpResponse<string | CoursePresentationModel>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
