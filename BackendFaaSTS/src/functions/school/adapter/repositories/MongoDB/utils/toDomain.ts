import { School } from '@functions/school/entities/School'
import { type ISchoolDocument } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'

export function toDomain (doc: ISchoolDocument): School {
  return new School({
    name: doc.name,
    address: {
      city: doc.address.city,
      complement: doc.address.complement,
      district: doc.address.district,
      number: doc.address.number,
      postCode: doc.address.postCode,
      state: doc.address.state,
      street: doc.address.street
    },
    active: doc.active
  }, doc.id)
}
