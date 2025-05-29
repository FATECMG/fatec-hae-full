import { type Email, type Password, type Phone, type RegisterNumber } from '@common/entity/valueObjects'
import { type academicTitles } from '@functions/user/entities/User'

export type UserDTOProps = {
  name: string
  email: Email
  password: Password
  phone: Phone
  roles: string
  courses?: UserCourseDTO[]
  registerNumber: RegisterNumber
  active?: boolean
  academicTitle: academicTitles
}

export type UserCourseDTO = {
  id: string
  name: string
}

/**
 * UserDTO is a class that encapsulates the data that is received from the client to interact with user resources.
 * It is used to create a user entity.
 * The DTO stands for Data Transfer Object.
 * @see
 * - {@link ../User.ts}
 * - {@link https://en.wikipedia.org/wiki/Data_transfer_object}
 */
export class UserDTO {
  name: string
  email: Email
  password: Password
  phone: Phone
  courses: UserCourseDTO[]
  roles: string
  registerNumber: RegisterNumber
  active: boolean
  academicTitle: academicTitles

  /**
   * Creates a new instance of the `UserDTO` class.
   * @param {UserDTOProps} userDTOProps - An object that contains the properties of the user DTO.
   * @param {PasswordHasher} hashPassword - A function that hashes a password.
   */
  constructor (userDTOProps: UserDTOProps) {
    this.name = userDTOProps.name
    this.email = userDTOProps.email
    this.password = userDTOProps.password
    this.roles = userDTOProps.roles
    this.phone = userDTOProps.phone
    this.courses = userDTOProps.courses ?? []
    this.registerNumber = userDTOProps.registerNumber
    this.active = userDTOProps.active ?? true
    this.academicTitle = userDTOProps.academicTitle
  }
}
