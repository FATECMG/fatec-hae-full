import { type DeleteController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const deleteController = schoolContainer.get<DeleteController>(SchoolLocator.SchoolDeleteController)

export const DeleteSchoolHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deleteController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
