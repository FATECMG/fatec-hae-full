import { type User } from '@functions/user/entities/User'
import { type UserDocument, UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'

export function toModel (user: User): UserDocument {
  return new UserModel({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    phone: user.phone,
    courses: user.courses,
    roles: user.roles,
    registerNumber: user.registerNumber,
    academicTitle: user.academicTitle,
    active: user.active
  })
}
