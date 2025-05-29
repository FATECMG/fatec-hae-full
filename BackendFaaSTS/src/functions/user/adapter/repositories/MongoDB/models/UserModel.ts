import { type IEntity } from '@common/repository/mongodb/BaseMongoEntity'
import { type UserProps } from '@functions/user/entities/User'
import mongoose, { Schema } from 'mongoose'

export interface UserDocument extends IEntity, UserProps {

}
/**
 * User Schema modeled for MongoDB. Its schema is based on the UserDocument interface.
 * @see {@link UserDocument}
 */

const userSchema = new Schema<UserDocument>({
  id: { type: 'string', unique: true },
  name: { type: 'string', required: true },
  password: { type: 'string', required: true, max: 150 },
  phone: { type: 'string', required: true },
  active: { type: 'boolean', required: true, index: true },
  roles: { type: 'string', required: true },
  courses: [{ type: Object, required: true }],
  registerNumber: { type: 'string', required: true, unique: true },
  email: { type: 'string', required: true, unique: true },
  academicTitle: { type: 'string', required: true }
}, {
  autoIndex: true
})
/**
 * Model created based on the User Schema.
 * It is used to execute CRUD operations in the User collection.
 * @see {@link userSchema}
 */
export const UserModel = mongoose.model<UserDocument>('User', userSchema)
