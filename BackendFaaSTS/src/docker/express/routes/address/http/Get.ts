import { type FieldError } from '@common/error/ValidationError'
import { type HttpResponse } from '@common/http/Types'

import { type AddressController } from '@functions/address/controller/AddressController'
import { type Address } from '@functions/address/entities/Address'
import { AddressContainer } from '@functions/address/shared/Di.container'
import { AddressLocator } from '@functions/address/shared/Di.enums'

const getController = AddressContainer.get<AddressController>(AddressLocator.AddressController)

export const GetAllAddressHandler = async (id?: string): Promise<HttpResponse<string | Address | FieldError[] | undefined>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
