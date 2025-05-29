import { type SaveController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { type School } from '@functions/school/entities/School'
import { SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const saveController = schoolContainer.get<SaveController<SchoolDTO, School, SchoolPM>>(SchoolLocator.SchoolCreateController)

export const PostSchoolHandler = async (req: any): Promise<HttpResponse<string | SchoolPM | FieldError | FieldError[]>> => {
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
  const response = await saveController.handle(param)
  return { data: response.data, statusCode: response.statusCode }
}
