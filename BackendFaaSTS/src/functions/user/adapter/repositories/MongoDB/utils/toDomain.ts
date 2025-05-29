import { User } from '@functions/user/entities/User'
import { type UserDocument } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'

export function toDomain (doc: UserDocument): User {
  return new User({
    name: doc.name,
    email: doc.email,
    password: doc.password,
    roles: doc.roles,
    courses: doc.courses,
    academicTitle: doc.academicTitle,
    phone: doc.phone,
    registerNumber: doc.registerNumber,
    active: doc.active
  }, doc.id)
}
