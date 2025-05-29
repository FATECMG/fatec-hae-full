import { type ActivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Course } from '@functions/course/entities/Course'
import { courseContainer } from '@functions/course/shared/Di.container'
import { CourseLocator } from '@functions/course/shared/Di.enums'

const activateController = courseContainer.get<ActivateController<Course>>(CourseLocator.CourseActivateController)

export const PatchActivateCourseHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await activateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
