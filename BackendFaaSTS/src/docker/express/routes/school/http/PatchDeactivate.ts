import { type DeactivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type School } from '@functions/school/entities/School'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const deactivateController = schoolContainer.get<DeactivateController<School>>(SchoolLocator.SchoolDeactivateController)

export const PatchDeactivateSchoolHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deactivateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
