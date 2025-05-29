import { type UpdateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { type School } from '@functions/school/entities/School'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const putController = schoolContainer.get<UpdateController<SchoolDTO, School, SchoolPM>>(SchoolLocator.SchoolUpdateController)

export const PutSchoolHandler = async (req: any, id?: string): Promise<HttpResponse<string | SchoolPM | FieldError | FieldError[]>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const request = req.body
  const param = new SchoolDTO({
    name: request.name,
    address: {
      postCode: request.address.postCode,
      city: request.address.city,
      complement: request.address.complement,
      street: request.address.street,
      number: request.address.number,
      district: request.address.district,
      state: request.address.state
    }
  })
  const response = await putController.handle(param, id)
  return { data: response.data, statusCode: response.statusCode }
}
