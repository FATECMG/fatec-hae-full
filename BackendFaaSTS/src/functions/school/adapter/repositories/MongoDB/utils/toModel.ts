import { type School } from '@functions/school/entities/School'
import { SchoolModel, type ISchoolDocument } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'

export function toModel (entity: School): ISchoolDocument {
  return new SchoolModel({
    id: entity.id,
    name: entity.name,
    active: entity.active,
    address: {
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      district: entity.address.district,
      postCode: entity.address.postCode,
      state: entity.address.state
    }
  })
}
