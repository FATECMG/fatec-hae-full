import { type Address } from '@functions/school/entities/Address'

import { Schema } from 'mongoose'

export interface IAddressDocument extends Address {
}
/**
 * Address Schema modeled for MongoDB. Its schema is based on the IAddressDocument interface.
 * It is not necessary to create a model for it, since it is a subdocument of the School model.
 * @see {@link IAddressDocument}
 */

export const AddressSchema = new Schema<IAddressDocument>({
  street: {
    type: 'string',
    required: true
  },
  number: {
    type: 'string',
    required: true
  },
  complement: {
    type: 'string',
    required: false
  },
  city: {
    type: 'string',
    required: true,
    index: true
  },
  postCode: {
    type: 'string',
    required: true,
    index: true
  },
  district: {
    type: 'string',
    required: true
  },
  state: {
    type: 'string',
    required: true
  }
}, {
  _id: false,
  autoIndex: true
})

AddressSchema.index({ state: 1, city: 1 })
