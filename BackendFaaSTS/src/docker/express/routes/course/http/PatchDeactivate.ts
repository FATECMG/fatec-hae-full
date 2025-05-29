import { type DeactivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Course } from '@functions/course/entities/Course'
import { courseContainer } from '@functions/course/shared/Di.container'
import { CourseLocator } from '@functions/course/shared/Di.enums'

const deactivateController = courseContainer.get<DeactivateController<Course>>(CourseLocator.CourseDeactivateController)

export const PatchDeactivateCourseHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deactivateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
