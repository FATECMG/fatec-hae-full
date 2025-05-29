import { type FindAllController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Course } from '@functions/course/entities/Course'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { courseContainer } from '@functions/course/shared/Di.container'
import { CourseLocator } from '@functions/course/shared/Di.enums'

const getController = courseContainer.get<FindAllController<Course, CoursePresentationModel>>(CourseLocator.CourseFindAllController)

export const GetAllCourseHandler = async (activeParam?: string): Promise<HttpResponse<CoursePresentationModel[]>> => {
  let active: boolean = true
  if (activeParam !== undefined) {
    active = activeParam !== 'false'
  }
  const response = await getController.handle(active)
  return { data: response.data, statusCode: response.statusCode }
}
