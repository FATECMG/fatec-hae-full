import { type FindOneController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const getController = schoolContainer.get<FindOneController<School, SchoolPM>>(SchoolLocator.SchoolFindOneController)

export const GetSchoolHandler = async (id?: string): Promise<HttpResponse<string | SchoolPM>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
