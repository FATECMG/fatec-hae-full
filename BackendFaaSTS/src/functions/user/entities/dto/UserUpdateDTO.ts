import { type Email, type Phone, type RegisterNumber } from '@common/entity/valueObjects'
import { type UserCourseDTO } from './UserDTO'
import { type academicTitles } from '@functions/user/entities/User'

type UserUpdateDTOProps = {
  name: string
  email: Email
  phone: Phone
  courses?: UserCourseDTO[]
  roles: string
  registerNumber: RegisterNumber
  active?: boolean
  academicTitle: academicTitles
}
/**
 * UserUpdateDTO similar to UsertDTO, but it does not require a password.
 * It is use to update a user entity.
 * @see {@link UserDTO}
 */
export class UserUpdateDTO {
  name: string
  email: Email
  phone: Phone
  courses: UserCourseDTO[]
  roles: string
  registerNumber: RegisterNumber
  active: boolean
  academicTitle: string

  constructor (userDTOProps: UserUpdateDTOProps) {
    this.name = userDTOProps.name
    this.email = userDTOProps.email
    this.roles = userDTOProps.roles
    this.phone = userDTOProps.phone
    this.courses = userDTOProps.courses ?? []
    this.registerNumber = userDTOProps.registerNumber
    this.active = userDTOProps.active ?? true
    this.academicTitle = userDTOProps.academicTitle
  }
}
