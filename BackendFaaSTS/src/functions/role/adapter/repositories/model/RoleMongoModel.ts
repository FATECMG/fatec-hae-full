import mongoose, { Schema, type Document } from 'mongoose'

export interface RoleDocument extends Document {
  id: string
  name: string
  active: boolean
}

/**
 * Role Schema modeled for MongoDB. Its schema is based on the RoleDocument interface.
 * @see {@link RoleDocument}
 */
const roleSchema = new Schema<RoleDocument>({
  id: { type: 'string', required: true, unique: true },
  name: { type: 'string', required: true, unique: true },
  active: { type: 'boolean', required: true }
})
/**
 * Model created based on the Role Schema.
 * It is used to execute READ operations in the Roles collection.
 * @see {@link roleSchema}
 */
export const RoleModel = mongoose.model<RoleDocument>('Role', roleSchema)
