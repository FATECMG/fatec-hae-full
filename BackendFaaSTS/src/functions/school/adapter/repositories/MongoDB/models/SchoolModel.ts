import { AddressSchema, type IAddressDocument } from '@functions/school/adapter/repositories/MongoDB/models/AddressModel'

import mongoose, { Schema, type Document } from 'mongoose'
export interface ISchoolDocument extends Document {
  id: string
  active: boolean
  name: string
  address: IAddressDocument
}
/**
 * School Schema modeled for MongoDB. Its schema is based on the RoleDocument interface.
 * @see {@link RoleDocument}
 */
export const SchoolSchema = new Schema<ISchoolDocument>({
  id: {
    type: 'string',
    required: true,
    unique: true
  },
  active: {
    type: 'boolean',
    required: true,
    index: true
  },
  name: {
    type: 'string',
    required: true,
    unique: true
  },
  address: AddressSchema
}, {
  autoIndex: true
})

/**
 * Model created based on the School Schema.
 * It is used to execute CRUD operations in the School collection.
 * @see {@link SchoolSchema}
 */
export const SchoolModel = mongoose.model<ISchoolDocument>('school', SchoolSchema)
