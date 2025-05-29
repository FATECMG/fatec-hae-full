import { type Email, type Phone, type RegisterNumber } from '@common/entity/valueObjects'
import { type academicTitles, type UserCourse } from '@functions/user/entities/User'

export type UserProps = {
  name: string
  email: Email
  phone: Phone
  courses?: UserCourse[]
  roles: string
  registerNumber: RegisterNumber
  active: boolean
  academicTitle: academicTitles
}
/**
 * @class
 * UserUpdate is a class utilized only for update user data.
 * Its usage is for representing the user domain entity when updating user data.
 */
export class UserUpdate {
  id: string
  name: string
  email: Email
  phone: Phone
  courses: UserCourse[]
  roles: string
  registerNumber: RegisterNumber
  active: boolean
  academicTitle: string

  constructor (userProps: UserProps, id?: string) {
    this.id = id ?? ''
    this.name = userProps.name
    this.email = userProps.email
    this.phone = userProps.phone
    this.courses = userProps.courses ?? []
    this.registerNumber = userProps.registerNumber
    this.roles = userProps.roles
    this.active = userProps.active
    this.academicTitle = userProps.academicTitle
  }
}
