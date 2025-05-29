import { type DeleteController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { courseContainer } from '@functions/course/shared/Di.container'
import { CourseLocator } from '@functions/course/shared/Di.enums'

const deleteController = courseContainer.get<DeleteController>(CourseLocator.CourseDeleteController)

export const DeleteCourseHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deleteController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
